import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatInterfaceProps {
  onMessageLimitReached: () => void;
  isTrialMode: boolean;
  messageCount: number;
  onMessageSent: () => void;
}

const ChatInterface = ({ onMessageLimitReached, isTrialMode, messageCount, onMessageSent }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Ciao! Sono Tino, il tuo lievitista digitale. Come posso aiutarti oggi?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    if (isTrialMode && messageCount >= 10) {
      onMessageLimitReached();
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    
    // Increment message count for trial mode
    if (isTrialMode) {
      onMessageSent();
    }

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "Questa è una risposta di esempio. La funzionalità completa sarà disponibile presto!",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border shadow-soft overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <Avatar className="h-10 w-10 border-2 border-primary">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            T
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-foreground">Tino</h3>
          <p className="text-xs text-muted-foreground">Il tuo lievitista digitale</p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {message.sender === "bot" && (
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    T
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Trial Mode Warning */}
      {isTrialMode && messageCount >= 7 && (
        <div className="px-4 py-2 bg-accent/10 border-t border-accent/20">
          <p className="text-xs text-accent-foreground text-center">
            {10 - messageCount} messaggi rimanenti nella prova gratuita
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Scrivi il tuo messaggio..."
            className="flex-1 bg-background border-border focus-visible:ring-primary"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
