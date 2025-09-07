import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Heart, Send, Trash2, Clock, AlertTriangle, ArrowLeft, Menu, Smile } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';
import { BannerBadge } from '@/components/BannerBadge';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useActivityRewards } from '@/hooks/useActivityRewards';
import { toast } from 'sonner';

export default function Chat() {
  const [newMessage, setNewMessage] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, loading, sendMessage, giveHeart, deleteMessage, clearAllMessages } = useChat();
  const { giveActivityReward } = useActivityRewards();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sistema de reinicio global cada 30 minutos
  useEffect(() => {
    console.log('🕐 Iniciando sistema de reinicio automático...');
    
    // Calcular el próximo reinicio basado en intervalos fijos de 30 minutos
    const now = new Date();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    
    console.log(`⏰ Hora actual: ${now.toLocaleTimeString()}`);
    
    // Próximo reinicio será a los minutos 0 o 30 de la hora
    let nextResetMinutes;
    if (currentMinutes < 30) {
      nextResetMinutes = 30;
    } else {
      nextResetMinutes = 60; // Siguiente hora
    }
    
    const resetTime = new Date(now);
    resetTime.setMinutes(nextResetMinutes, 0, 0); // Establecer segundos y milisegundos a 0
    
    console.log(`⏰ Próximo reinicio programado para: ${resetTime.toLocaleTimeString()}`);
    
    const updateTimer = () => {
      const now = new Date();
      const diff = resetTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        console.log('🔄 ¡Tiempo de reinicio alcanzado! Ejecutando clearAllMessages...');
        setTimeLeft('Reiniciando...');
        clearAllMessages();
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);

      // Sistema de avisos globales mejorado
      // Aviso a los 5 minutos
      if (diff <= 5 * 60 * 1000 && diff > 5 * 60 * 1000 - 1000) {
        console.log('⚠️ Aviso de 5 minutos activado');
        toast.warning('⚠️ El chat se reiniciará en 5 minutos', {
          duration: 5000,
          id: 'warning-5min'
        });
      }
      
      // Aviso a los 3 minutos
      if (diff <= 3 * 60 * 1000 && diff > 3 * 60 * 1000 - 1000) {
        console.log('⚠️ Aviso de 3 minutos activado');
        toast.warning('⚠️ El chat se reiniciará en 3 minutos', {
          duration: 5000,
          id: 'warning-3min'
        });
      }
      
      // Aviso a 1 minuto
      if (diff <= 1 * 60 * 1000 && diff > 1 * 60 * 1000 - 1000) {
        console.log('🚨 Aviso de 1 minuto activado');
        toast.error('🚨 El chat se reiniciará en 1 minuto', {
          duration: 10000,
          id: 'warning-1min'
        });
      }

      // Cuenta regresiva final a partir de 30 segundos
      if (diff <= 30000 && diff > 0) {
        const secondsLeft = Math.ceil(diff / 1000);
        setCountdown(secondsLeft);
        
        if (secondsLeft === 30) {
          console.log('🚨 Iniciando cuenta regresiva final de 30 segundos');
          toast.error('🚨 REINICIO GLOBAL: Chat reiniciándose en 30 segundos...', {
            duration: 30000,
            id: 'countdown-final'
          });
        }
      } else {
        setCountdown(null);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => {
      console.log('🔄 Limpiando timer de reinicio automático');
      clearInterval(interval);
    };
  }, [clearAllMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    await sendMessage(newMessage);
    giveActivityReward('first_message');
    setNewMessage('');
  };

  const handleGiveHeart = async (userId: string) => {
    await giveHeart(userId);
  };

  const handleUserClick = (userId: string) => {
    giveActivityReward('profile_visit');
    navigate(`/profile/${userId}`);
  };

  const commonEmojis = ['😀', '😂', '❤️', '👍', '👎', '😍', '😢', '😮', '😡', '🔥', '💪', '🎉', '👏', '🙏', '💯'];

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false); // Cerrar automáticamente el selector
  };


  return (
    <AppLayout>
      <div className="flex flex-col h-screen max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="glass border-b border-border/50 p-3 md:p-4 shrink-0">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg md:text-xl font-bold cyber-glow">H Chat</h1>
                <p className="text-xs text-muted-foreground">
                  {messages.length} mensajes • Reinicio automático cada 30min
                </p>
              </div>
            </div>
            
            {/* Timer and Status - Mobile friendly */}
            <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
              {/* Reset Timer */}
              {messages.length > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono">{timeLeft}</span>
                </div>
              )}
              
              {/* Countdown Warning */}
              {countdown && (
                <div className="flex items-center gap-1 text-destructive animate-pulse font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-mono text-sm">{countdown}s</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="hidden sm:inline">En línea</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground py-12">
              <div className="animate-pulse">Cargando mensajes...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <div className="space-y-2">
                <p className="text-lg">¡Sé el primero en escribir un mensaje!</p>
                <p className="text-sm opacity-70">Inicia la conversación</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = user?.id === message.user_id;
              const prevMessage = messages[index - 1];
              const isConsecutiveMessage = prevMessage?.user_id === message.user_id;
              
              return (
                <div key={message.id} className={`flex gap-3 group ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar Column */}
                  <div className="flex flex-col items-center shrink-0">
                    {!isConsecutiveMessage && (
                      <UserAvatar 
                        src={message.profile?.avatar_url} 
                        name={message.profile?.username || 'Usuario'}
                        size="md"
                        className="mb-1"
                      />
                    )}
                    {!isOwnMessage && !isConsecutiveMessage && (
                      <div className="flex flex-col items-center gap-1 mt-1">
                        <button
                          onClick={() => handleGiveHeart(message.user_id)}
                          className="p-1.5 rounded-full hover:bg-heart/10 hover:scale-110 transition-all duration-200 group/heart"
                        >
                          <Heart className="w-4 h-4 text-muted-foreground group-hover/heart:text-heart group-hover/heart:fill-current transition-all" />
                        </button>
                        <span className="text-xs text-muted-foreground font-medium">
                          {message.profile?.hearts_count || 0}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className={`flex-1 min-w-0 max-w-[75%] ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    {/* User Info Header - Only show for first message in sequence */}
                    {!isConsecutiveMessage && (
                      <div className={`flex items-center gap-2 mb-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <button
                          onClick={() => handleUserClick(message.user_id)}
                          className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
                        >
                          {message.profile?.username || 'Usuario'}
                        </button>
                        
                        {/* Banner Display */}
                        {message.equipped_banners
                          ?.sort((a, b) => a.position - b.position)
                          .slice(0, 1)
                          .map((banner, index) => (
                            <div key={index} className="flex items-center">
                              <BannerBadge
                                name={banner.banner.name}
                                emoji={banner.banner.emoji}
                                rarity={banner.banner.rarity as any}
                                size="sm"
                              />
                            </div>
                          ))}
                        
                        <span className="text-xs text-muted-foreground/70">
                          {new Date(message.created_at).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div className={`relative flex items-start gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`
                          px-4 py-3 rounded-2xl shadow-sm border backdrop-blur-sm
                          ${isOwnMessage 
                            ? 'bg-primary text-primary-foreground border-primary/20 rounded-tr-md' 
                            : 'bg-card text-card-foreground border-border/50 rounded-tl-md'
                          }
                          ${isConsecutiveMessage ? 'mt-1' : 'mt-0'}
                          hover:shadow-md transition-all duration-200
                        `}
                      >
                        <p className="text-sm leading-relaxed break-words">
                          {message.content}
                        </p>
                      </div>
                      
                      {/* Delete Button for Own Messages */}
                      {isOwnMessage && (
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-destructive/10 transition-all duration-200 shrink-0 self-end mb-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive transition-colors" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="glass border-t border-border/50 p-4 shrink-0 mt-auto">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mb-3 p-2 bg-background-secondary rounded-lg border border-border/50">
              <div className="flex flex-wrap gap-2">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:bg-background-tertiary p-1 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="px-3 h-10 text-muted-foreground hover:text-foreground"
              >
                <Smile className="w-4 h-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-background-secondary border-border/50 h-10"
                maxLength={500}
              />
            </div>
            <Button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-gradient-primary hover:scale-105 transition-all glow-primary disabled:opacity-50 px-4 h-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}