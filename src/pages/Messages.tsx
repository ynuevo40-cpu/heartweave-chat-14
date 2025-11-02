import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Smile, Image as ImageIcon, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: number;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

const Messages = () => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "María García",
      avatar: "/placeholder.svg",
      content: "¡Hola a todos! ¿Alguien tiene apuntes de la clase de algoritmos?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      user: "Carlos Ruiz",
      avatar: "/placeholder.svg",
      content: "Sí, yo los tengo. Te los puedo pasar después de clase.",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      user: "Ana López",
      avatar: "/placeholder.svg",
      content: "Recuerden que mañana es la entrega del proyecto de base de datos 📚",
      timestamp: "10:35 AM",
    },
    {
      id: 4,
      user: "Tú",
      avatar: "/placeholder.svg",
      content: "Gracias por recordarlo Ana!",
      timestamp: "10:36 AM",
      isCurrentUser: true,
    },
    {
      id: 5,
      user: "Luis Martínez",
      avatar: "/placeholder.svg",
      content: "¿Alguien quiere formar equipo para el hackathon del próximo mes?",
      timestamp: "10:40 AM",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      user: "Tú",
      avatar: "/placeholder.svg",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      
      <main className="flex-1 flex flex-col pb-16 pt-16">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Group Header */}
          <Card className="border-x-0 border-t-0 rounded-none bg-card/95 backdrop-blur-md sticky top-16 z-30 flex-shrink-0">
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">UC</span>
                  </div>
                  <Badge className="absolute -top-1 -right-1 bg-accent text-white border-2 border-card px-1.5 py-0 text-xs">
                    1.2K
                  </Badge>
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-foreground">UniConnect</h2>
                  <p className="text-sm text-muted-foreground">1,234 miembros · 156 en línea</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isCurrentUser ? 'flex-row-reverse' : ''}`}
              >
                {!message.isCurrentUser && (
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm">
                      {message.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex-1 max-w-[70%] ${message.isCurrentUser ? 'flex flex-col items-end' : ''}`}>
                  {!message.isCurrentUser && (
                    <p className="text-sm font-semibold text-foreground mb-1">{message.user}</p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      message.isCurrentUser
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-card border border-border rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <Card className="border-x-0 border-b-0 rounded-none bg-card/95 backdrop-blur-md flex-shrink-0">
            <div className="p-3 border-t border-border">
              <div className="flex items-end gap-2">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="pr-12 py-6 rounded-full border-border bg-secondary/50 focus:bg-background transition-colors"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-accent hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Messages;