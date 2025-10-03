import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('🔍 Moderando mensaje del usuario:', userId);

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Faltan parámetros requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Llamar a Lovable AI para análisis de toxicidad
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY no configurada');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Eres un moderador de contenido. Analiza si el siguiente mensaje contiene contenido tóxico, ofensivo, insultos, acoso, discriminación o lenguaje inapropiado.
            
Responde SOLO con un JSON válido en este formato exacto:
{
  "is_toxic": boolean,
  "severity": number (1-3),
  "reason": "explicación breve en español"
}

Criterios:
- Severity 1: Lenguaje levemente inapropiado
- Severity 2: Insultos claros o lenguaje ofensivo
- Severity 3: Acoso grave, discriminación, amenazas`
          },
          {
            role: 'user',
            content: message
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ Error AI Gateway:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Límite de rate excedido. Intenta más tarde.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('🤖 Respuesta AI:', JSON.stringify(aiData));

    // Parsear respuesta de IA
    let analysisResult;
    try {
      const content = aiData.choices[0].message.content;
      // Limpiar markdown si existe
      const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
      analysisResult = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('❌ Error parseando respuesta AI:', parseError);
      // Si falla el parseo, asumimos que no es tóxico
      analysisResult = { is_toxic: false, severity: 0, reason: 'Error en análisis' };
    }

    console.log('📊 Resultado análisis:', analysisResult);

    // Si no es tóxico, permitir mensaje
    if (!analysisResult.is_toxic) {
      console.log('✅ Mensaje aprobado');
      return new Response(
        JSON.stringify({ 
          allowed: true, 
          message: 'Mensaje aprobado' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mensaje es tóxico - aplicar sistema de penalizaciones
    console.log('🚨 Mensaje tóxico detectado - Aplicando penalización');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('warning_count, hearts_count, is_banned, banned_until')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ Error obteniendo perfil:', profileError);
      throw profileError;
    }

    const currentWarnings = profile.warning_count || 0;
    const newWarningCount = currentWarnings + 1;

    console.log(`⚠️ Advertencias: ${currentWarnings} -> ${newWarningCount}`);

    // Registrar advertencia
    const { error: warningError } = await supabase
      .from('user_warnings')
      .insert({
        user_id: userId,
        warning_type: 'toxic_message',
        message_content: message,
        severity: analysisResult.severity,
        reason: analysisResult.reason
      });

    if (warningError) {
      console.error('❌ Error registrando advertencia:', warningError);
    }

    let action = '';
    let heartsLost = 0;
    let bannedUntil = null;
    let isBanned = false;

    // Aplicar penalizaciones según nivel
    if (newWarningCount === 1) {
      action = 'warning_1';
      console.log('⚠️ Primera advertencia');
    } else if (newWarningCount === 2) {
      action = 'warning_2';
      heartsLost = 20;
      console.log('⚠️ Segunda advertencia - Descontando 20 corazones');
    } else if (newWarningCount >= 3) {
      action = 'banned';
      heartsLost = 50;
      isBanned = true;
      bannedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 horas
      console.log('🚫 Baneo temporal por 24 horas');

      // Registrar baneo
      await supabase.from('user_bans').insert({
        user_id: userId,
        banned_until: bannedUntil,
        reason: `Tercera advertencia por contenido tóxico: ${analysisResult.reason}`,
        is_active: true
      });
    }

    // Actualizar perfil del usuario
    const newHeartsCount = Math.max(0, (profile.hearts_count || 0) - heartsLost);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        warning_count: newWarningCount,
        hearts_count: newHeartsCount,
        is_banned: isBanned,
        banned_until: bannedUntil
      })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Error actualizando perfil:', updateError);
    }

    console.log(`✅ Penalización aplicada: ${action}`);

    return new Response(
      JSON.stringify({
        allowed: false,
        action,
        warningCount: newWarningCount,
        heartsLost,
        bannedUntil,
        reason: analysisResult.reason
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Error en moderate-message:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
