import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ChiSiamo = () => {
  const [footerName, setFooterName] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem('lievitista_user_email');
    if (savedEmail) {
      setFooterEmail(savedEmail);
    }
  }, []);

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerName.trim()) {
      toast({
        title: "Nome mancante",
        description: "Inserisci il tuo nome.",
        variant: "destructive",
      });
      return;
    }
    if (!footerEmail.trim() || !footerEmail.includes("@")) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('upsert_email_lead', {
        p_email: footerEmail,
        p_nome: footerName,
        p_source: 'footer-newsletter',
        p_has_footer_interaction: true
      });
      
      if (error) throw error;
      
      // Save to localStorage
      localStorage.setItem('lievitista_user_email', footerEmail);
      localStorage.setItem('lievitista_email_timestamp', new Date().toISOString());
      
      toast({
        title: "Grazie per esserti iscritto!",
        description: "Riceverai presto l'accesso al gruppo privato Facebook.",
      });
      setFooterName("");
      setFooterEmail("");
    } catch (error) {
      console.error('Error in handleFooterSubmit:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-1">
        <Link to="/">
          <Button variant="ghost" className="mb-8 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla home
          </Button>
        </Link>
        
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Chi siamo
          </h1>
          
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <p>
              Siamo Alessandro e Simone, e abbiamo una confessione da fare: ci siamo ossessionati.
            </p>
            
            <p>
              Non solo col pane. Con il creare cose, sempre diverse. Uno di noi ha lanciato una startup, costruito tool per catturare idee creative, fatto podcast per Treccani, scritto di auto ed emozioni. L'altro ha perfezionato l'arte della panificazione, lanciato un podcast ed entrambi hanno studiato marketing e AI. Sembrano mondi lontanissimi, ma per noi è sempre stata la stessa cosa: quando qualcosa ci appassiona, non ci limitiamo a consumarla—la smontiamo, la capiamo, ci costruiamo qualcosa attorno.
            </p>
            
            <p>
              Il pane è stato l'ultimo di questi mondi. O forse il più ostinato.
            </p>
            
            <p>
              Da una parte c'è l'amore per la panificazione e la lievitazione naturale, quell'arte antica che trasforma ingredienti semplici in momenti preziosi. Dall'altra, l'entusiasmo per la tecnologia e le infinite possibilità che offre. Ma sotto, è la stessa cosa: la voglia di mettere le mani in pasta—letteralmente e metaforicamente.
            </p>
            
            <p>
              Ma tra "amore per il pane" e "costruire qualcosa che funzioni davvero" ci sono stati mesi di caos. Uno di noi ha bruciato così tanto pane che ha imparato a disattivare l'allarme antincendio a occhi chiusi. L'altro ha costruito tool digitali per ogni problema che incontrava. Entrambi abbiamo passato notti a leggere: uno paper scientifici sulla fermentazione, l'altro documentazione tecnica e casi studio di prodotti digitali.
            </p>
            
            <p>
              Abbiamo tenuto diari, fatto esperimenti, riempito freezer di campioni di lievito a temperature diverse. E quando ci siamo resi conto che il lievito madre era un problema risolvibile—non con magia, ma con metodo—abbiamo capito che insieme avevamo tutti i pezzi del puzzle.
            </p>
            
            <p className="font-semibold">
              Perché? Perché abbiamo capito una cosa: fare il pane con lievito madre è un casino non per colpa tua, ma perché nessuno ti spiega davvero le variabili in gioco. È come seguire una mappa di un'altra città e sperare di arrivare a destinazione.
            </p>
            
            <p>
              Crediamo che fare il pane in casa non dovrebbe essere complicato o stressante. Dovrebbe essere quello che è sempre stato: un momento di gioia, un rituale che unisce le famiglie, quell'odore che riempie la casa e dice "qui ci prendiamo cura di noi".
            </p>
            
            <p>
              Eppure tutto il mondo della panificazione amatoriale è fermo a forum anni '90 e video da 40 minuti dove "si sente a occhio". Per chi inizia è un incubo. Per chi persiste è una guerra di logoramento.
            </p>
            
            <p>
              Vogliamo creare gli strumenti che avremmo voluto avere noi quando guardavamo il nostro lievito madre chiedendoci: "Ma sei vivo o morto? Devo aspettare o è troppo tardi?" Strumenti che parlano chiaro, che trasformano l'esperienza di migliaia di panificatori in consigli pratici per il TUO impasto, nella TUA cucina, oggi.
            </p>
            
            <p>
              Perché questo è quello che sappiamo fare. Creare cose. Che sia una startup, un tool digitale, un podcast, o una pagnotta perfetta—per noi è lo stesso impulso. Vedere un problema, smontarlo, costruire la soluzione, condividerla. Il dominio cambia, ma l'approccio no.
            </p>
            
            <p>
              Non è solo un progetto di pane. E non è solo un progetto tech. È quello che succede quando due maker decidono di unire i loro mondi senza snaturare nessuno dei due.
            </p>
            
            <p className="font-semibold">
              Questo è solo l'inizio. Non abbiamo tutte le risposte, ma abbiamo tante domande e voglia di risolverle insieme. Siamo felici che tu sia qui.
            </p>
          </div>
        </article>
      </div>

      <Footer
        footerName={footerName}
        setFooterName={setFooterName}
        footerEmail={footerEmail}
        setFooterEmail={setFooterEmail}
        handleFooterSubmit={handleFooterSubmit}
      />
    </div>
  );
};

export default ChiSiamo;