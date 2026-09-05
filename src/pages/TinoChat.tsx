import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TinoChatComponent from "@/components/TinoChat";
import { supabase } from "@/integrations/supabase/client";
import tinoIcon from "@/assets/tino-icon.png";
import { useToast } from "@/hooks/use-toast";

const TinoChatPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('lievitista_user_email');
    const savedName = localStorage.getItem('lievitista_user_name');
    
    if (savedEmail && savedName) {
      setEmail(savedEmail);
      setName(savedName);
      setHasSubmittedEmail(true);
      
      // Track interaction for existing users
      handleTinoChatInteraction(savedEmail);
    }
  }, []);

  const handleTinoChatInteraction = async (userEmail: string) => {
    try {
      const { error } = await supabase
        .from('email_leads_landing')
        .update({ 
          has_tino_chat_page_interaction: true,
          last_interaction_at: new Date().toISOString()
        })
        .eq('email', userEmail);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking tino chat page interaction:', error);
    }
  };

  const handleEmailSubmit = async () => {
    if (!name || name.trim().length === 0) {
      toast({
        title: "Nome richiesto",
        description: "Inserisci il tuo nome per continuare",
        variant: "destructive",
      });
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('upsert_email_lead', {
        p_email: email,
        p_nome: name,
        p_source: 'tino_chat_page',
        p_has_tino_chat_page_interaction: true
      });

      if (error) throw error;

      localStorage.setItem('lievitista_user_email', email);
      if (name) localStorage.setItem('lievitista_user_name', name);

      setHasSubmittedEmail(true);
      setShowEmailDialog(false);

      toast({
        title: "Benvenuto!",
        description: "Ora puoi chattare con Tino",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[#FEF7CD] to-[#F1E5AC] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 p-3 flex items-center gap-4 bg-white/50 backdrop-blur-sm border-b border-[#8B7355]/20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="hover:bg-[#8B7355]/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <img 
            src={tinoIcon} 
            alt="Tino"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h1 className="text-lg font-semibold text-[#8B7355]">Tino</h1>
            <p className="text-sm text-[#8B7355]/70">Il Tuo Lievitista Digitale</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 p-3 md:p-4 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          {hasSubmittedEmail ? (
            <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden">
              <TinoChatComponent />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                  <img 
                    src={tinoIcon} 
                    alt="Tino"
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-2xl font-bold text-[#8B7355] mb-2">
                    Parla con Tino
                  </h2>
                  <p className="text-sm text-[#8B7355]/80">
                    Inserisci il tuo nome ed email per iniziare a chattare con Tino, il tuo assistente digitale per il lievito madre.
                  </p>
                </div>
                <div className="space-y-4">
                  <Input
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-[#8B7355]/30 focus:border-[#8B7355]"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                    className="border-[#8B7355]/30 focus:border-[#8B7355]"
                    required
                  />
                  <Button 
                    onClick={handleEmailSubmit}
                    className="w-full bg-[#8B7355] hover:bg-[#A0846C] text-white"
                  >
                    Inizia a Chattare
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TinoChatPage;