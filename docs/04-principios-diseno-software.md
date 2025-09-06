# Principios de Diseño del Software
## Aplicados en el Proyecto H Chat

### 1. Principios SOLID

#### 1.1 Single Responsibility Principle (SRP)
**Definición:** Cada clase o módulo debe tener una sola razón para cambiar.

**Aplicación en H Chat:**
```typescript
// ❌ VIOLACIÓN: Componente con múltiples responsabilidades
const ChatBad = () => {
  // Maneja estado del chat
  // Maneja autenticación
  // Maneja UI rendering
  // Maneja validaciones
};

// ✅ CORRECTO: Separación de responsabilidades
const Chat = () => {
  const { user } = useAuth();           // Solo autenticación
  const { messages, sendMessage } = useChat(); // Solo lógica de chat
  
  return <ChatUI messages={messages} onSend={sendMessage} />; // Solo UI
};
```

**Ejemplos implementados:**
- `useAuth`: Solo maneja autenticación
- `useChat`: Solo maneja lógica de mensajes
- `messageService`: Solo operaciones CRUD de mensajes
- `heartService`: Solo lógica de corazones

#### 1.2 Open/Closed Principle (OCP)
**Definición:** Abierto para extensión, cerrado para modificación.

**Aplicación en H Chat:**
```typescript
// Sistema de banners extensible
interface Banner {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: UnlockCondition;
}

// Nuevo tipo de condición sin modificar código existente
interface HeartBasedUnlock extends UnlockCondition {
  type: 'hearts';
  required: number;
}

interface MessageBasedUnlock extends UnlockCondition {
  type: 'messages';
  required: number;
}
```

#### 1.3 Liskov Substitution Principle (LSP)
**Aplicación en componentes UI:**
```typescript
// Base component
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

// Todos los botones pueden sustituir al base
const PrimaryButton: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button className="bg-primary" onClick={onClick}>{children}</button>
);

const SecondaryButton: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button className="bg-secondary" onClick={onClick}>{children}</button>
);
```

#### 1.4 Interface Segregation Principle (ISP)
**Aplicación en hooks:**
```typescript
// ❌ Interface monolítica
interface BadChatHook {
  messages: Message[];
  sendMessage: (content: string) => void;
  deleteMessage: (id: string) => void;
  giveHeart: (userId: string) => void;
  clearChat: () => void;
}

// ✅ Interfaces segregadas
interface ChatMessages {
  messages: Message[];
  sendMessage: (content: string) => void;
}

interface ChatModeration {
  deleteMessage: (id: string) => void;
  clearChat: () => void;
}

interface HeartInteraction {
  giveHeart: (userId: string) => void;
}
```

#### 1.5 Dependency Inversion Principle (DIP)
**Aplicación en servicios:**
```typescript
// Abstracción para persistencia
interface MessageRepository {
  fetchMessages(): Promise<ServiceResult<Message[]>>;
  createMessage(data: CreateMessageInput): Promise<ServiceResult<void>>;
}

// Implementación concreta
class SupabaseMessageRepository implements MessageRepository {
  async fetchMessages() {
    // Implementación específica de Supabase
  }
}

// Service depende de abstracción, no de implementación
class MessageService {
  constructor(private repository: MessageRepository) {}
}
```

### 2. Principios de Diseño de Clean Architecture

#### 2.1 Separation of Concerns
**Aplicación por capas:**

```
┌─────────────────────────────────────┐
│           UI Layer (React)          │
├─────────────────────────────────────┤
│        Business Logic (Hooks)       │
├─────────────────────────────────────┤
│        Data Layer (Services)        │
├─────────────────────────────────────┤
│       External APIs (Supabase)      │
└─────────────────────────────────────┘
```

**Ejemplo de implementación:**
```typescript
// UI Layer - Solo presentación
const MessageItem: React.FC<{ message: Message }> = ({ message }) => (
  <div className="message">
    <span>{message.content}</span>
    <time>{message.created_at}</time>
  </div>
);

// Business Logic Layer - Reglas de negocio
const useChat = () => {
  const validateMessage = (content: string): boolean => {
    return content.trim().length > 0 && content.length <= 280;
  };
  
  const sendMessage = async (content: string) => {
    if (!validateMessage(content)) {
      toast.error('Mensaje inválido');
      return;
    }
    // ... lógica de envío
  };
};

// Data Layer - Acceso a datos
const messageService = {
  async fetchMessages(): Promise<ServiceResult<Message[]>> {
    // Abstrae la complejidad de Supabase
  }
};
```

#### 2.2 Dependency Rule
**Implementación del flujo de dependencias:**
- UI depende de Business Logic
- Business Logic depende de Data Layer
- Data Layer depende de External APIs
- Las dependencias apuntan hacia adentro

### 3. Principios DRY, KISS y YAGNI

#### 3.1 DRY (Don't Repeat Yourself)
**Ejemplos de reutilización:**

```typescript
// Componente reutilizable para avatares
const UserAvatar: React.FC<{ user: UserProfile; size?: 'sm' | 'md' | 'lg' }> = ({
  user, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <img 
      src={user.avatar_url || '/default-avatar.png'} 
      alt={user.username}
      className={`rounded-full ${sizeClasses[size]}`}
    />
  );
};

// Hook reutilizable para operaciones de servicio
const useServiceOperation = <T>(
  operation: () => Promise<ServiceResult<T>>,
  successMessage?: string
) => {
  const [loading, setLoading] = useState(false);
  
  const execute = async () => {
    setLoading(true);
    try {
      const result = await operation();
      if (result.success && successMessage) {
        toast.success(successMessage);
      } else if (!result.success) {
        toast.error(result.error);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  return { execute, loading };
};
```

#### 3.2 KISS (Keep It Simple, Stupid)
**Ejemplos de simplicidad:**

```typescript
// ✅ Solución simple y directa
const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / 60000);
  
  if (diffInMinutes < 1) return 'ahora';
  if (diffInMinutes < 60) return `hace ${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)}h`;
  return messageDate.toLocaleDateString();
};

// ❌ Solución compleja innecesaria
const formatTimeAgoComplex = (date: string): string => {
  // Implementación con librerías externas, múltiples casos edge, 
  // configuraciones complejas que no aportan valor
};
```

#### 3.3 YAGNI (You Aren't Gonna Need It)
**Decisiones basadas en necesidad actual:**

```typescript
// ✅ Implementado: Funcionalidad requerida
interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

// ❌ No implementado: Funcionalidad especulativa
interface MessageWithUnnecessaryFeatures {
  // ... campos básicos
  reactions?: Reaction[];        // No solicitado
  attachments?: Attachment[];    // No solicitado  
  editHistory?: EditRecord[];    // No solicitado
  readReceipts?: ReadReceipt[];  // No solicitado
}
```

### 4. Principios de Diseño de UI/UX

#### 4.1 Consistency (Consistencia)
**Design System implementado:**

```typescript
// Tokens de diseño consistentes
const designTokens = {
  colors: {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    muted: 'hsl(var(--muted))'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem'
  },
  typography: {
    heading: 'text-2xl font-bold',
    body: 'text-base',
    caption: 'text-sm text-muted-foreground'
  }
};

// Componentes que usan el sistema consistentemente
const Button = ({ variant, size, children }) => (
  <button className={cn(buttonVariants({ variant, size }))}>
    {children}
  </button>
);
```

#### 4.2 Feedback inmediato
**Implementaciones de feedback:**

```typescript
// Loading states
const ChatInput = () => {
  const { sendMessage, loading } = useChat();
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" disabled={loading} />
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner /> : 'Enviar'}
      </Button>
    </form>
  );
};

// Toast notifications
const giveHeart = async (receiverId: string) => {
  const result = await heartService.giveHeart({ giverId: user.id, receiverId });
  
  if (result.success) {
    toast.success('¡Corazón enviado! ❤️');
  } else {
    toast.error(result.error || 'Error al enviar corazón');
  }
};
```

#### 4.3 Progressive Disclosure
**Información gradual:**

```typescript
// Banner básico vs detallado
const BannerCard = ({ banner, detailed = false }) => (
  <div className="banner-card">
    <span className="text-2xl">{banner.emoji}</span>
    <h3>{banner.name}</h3>
    
    {detailed && (
      <>
        <p className="text-sm text-muted-foreground">{banner.description}</p>
        <Badge variant={banner.rarity}>{banner.rarity}</Badge>
        <p className="text-xs">Requiere {banner.hearts_required} corazones</p>
      </>
    )}
  </div>
);
```

### 5. Principios de Performance

#### 5.1 Lazy Loading
```typescript
// Componentes cargados bajo demanda
const BannerSettings = lazy(() => import('@/pages/BannerSettings'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));

// En el router
<Route 
  path="/banners" 
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <BannerSettings />
    </Suspense>
  } 
/>
```

#### 5.2 Memoización estratégica
```typescript
// Memo para componentes costosos
const MessageList = React.memo(({ messages }: { messages: Message[] }) => (
  <div className="messages">
    {messages.map(message => (
      <MessageItem key={message.id} message={message} />
    ))}
  </div>
));

// useMemo para cálculos pesados
const sortedMessages = useMemo(
  () => messages.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  ),
  [messages]
);
```

### 6. Principios de Testing

#### 6.1 Test Pyramid
```
    ┌─────────────┐
    │   E2E Tests │  ← Pocos, críticos
    ├─────────────┤
    │Integration │  ← Algunos, flows importantes  
    │    Tests    │
    ├─────────────┤
    │ Unit Tests  │  ← Muchos, cobertura amplia
    └─────────────┘
```

#### 6.2 Arrange-Act-Assert Pattern
```typescript
describe('HeartService', () => {
  it('should prevent duplicate hearts', async () => {
    // Arrange
    const mockInput = {
      giverId: 'user1',
      receiverId: 'user2'
    };
    
    // Act
    await heartService.giveHeart(mockInput);
    const result = await heartService.giveHeart(mockInput);
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.isDuplicate).toBe(true);
  });
});
```

### 7. Beneficios Obtenidos

#### 7.1 Mantenibilidad
- Código modular y bien estructurado
- Cambios localizados y predecibles
- Testing confiable y automatizado

#### 7.2 Escalabilidad
- Arquitectura preparada para crecimiento
- Componentes reutilizables
- Patrones consistentes

#### 7.3 Developer Experience
- Código autodocumentado
- TypeScript para safety
- Herramientas de desarrollo optimizadas

Los principios de diseño aplicados resultaron en una aplicación robusta, mantenible y escalable que cumple con estándares profesionales de desarrollo de software.