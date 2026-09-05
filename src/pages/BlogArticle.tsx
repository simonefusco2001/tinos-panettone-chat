import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import logoImage from "@/assets/logo.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const blogArticles = {
  "come-gestire-il-lievito-madre": {
    title: "Come gestire il lievito madre",
    date: "15 Novembre 2025",
    content: `
      <h2 class="text-2xl font-bold mt-8 mb-4">Introduzione</h2>
      <p class="mb-4">
        Il lievito madre è un organismo vivo che richiede cure costanti e attenzione. In questa guida 
        completa scoprirai tutti i segreti per mantenerlo sano e attivo nel tempo.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Temperature ideali</h2>
      <p class="mb-4">
        La temperatura ambiente gioca un ruolo fondamentale nella gestione del lievito madre. 
        L'intervallo ottimale è tra 26°C e 28°C per ottenere una fermentazione equilibrata.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Tempi di rinfresco</h2>
      <p class="mb-4">
        Il rinfresco regolare è essenziale. Durante i mesi caldi, potrebbe essere necessario rinfrescare 
        più frequentemente, mentre in inverno i tempi possono allungarsi. Osserva sempre il tuo lievito 
        e impara a riconoscerne i segnali.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Conservazione</h2>
      <p class="mb-4">
        Se non panifichi quotidianamente, puoi conservare il lievito madre in frigorifero. Ricorda di 
        rinfrescarlo almeno una volta a settimana e di portarlo a temperatura ambiente prima di utilizzarlo.
      </p>
    `,
  },
  "il-primo-panettone": {
    title: "Il tuo primo panettone",
    date: "10 Novembre 2025",
    content: `
      <h2 class="text-2xl font-bold mt-8 mb-4">Preparazione del lievito</h2>
      <p class="mb-4">
        Il panettone richiede un lievito madre molto forte e attivo. Inizia a preparare il tuo lievito 
        almeno 2 settimane prima, con rinfreschi quotidiani a temperatura controllata.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Ingredienti di qualità</h2>
      <p class="mb-4">
        La qualità degli ingredienti fa la differenza. Scegli farina Manitoba forte, burro di alta qualità, 
        uova fresche e canditi di prima scelta. Non lesinare sulla qualità: il panettone è un prodotto 
        d'eccellenza.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Il primo impasto</h2>
      <p class="mb-4">
        Il primo impasto è fondamentale. Lavora gli ingredienti fino ad ottenere un impasto liscio ed 
        elastico. La temperatura finale dell'impasto dovrebbe essere intorno ai 26-27°C.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Lievitazione e cottura</h2>
      <p class="mb-4">
        La lievitazione richiede pazienza. Il panettone deve triplicare il suo volume prima di essere 
        infornato. La cottura deve essere lenta e a temperatura controllata per ottenere una struttura 
        perfetta.
      </p>
    `,
  },
  "errori-comuni-lievitazione": {
    title: "Errori comuni nella lievitazione",
    date: "5 Novembre 2025",
    content: `
      <h2 class="text-2xl font-bold mt-8 mb-4">Temperatura sbagliata</h2>
      <p class="mb-4">
        Uno degli errori più comuni è non controllare la temperatura dell'ambiente e dell'impasto. 
        Temperature troppo basse rallentano la fermentazione, mentre temperature troppo alte possono 
        portare ad acidità eccessiva.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Tempi di lievitazione</h2>
      <p class="mb-4">
        Molti principianti hanno fretta e non rispettano i tempi di lievitazione. Il lievito madre ha 
        bisogno dei suoi tempi: accelerare il processo porta inevitabilmente a risultati deludenti.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Idratazione dell'impasto</h2>
      <p class="mb-4">
        L'idratazione è cruciale. Un impasto troppo asciutto sarà duro e difficile da lavorare, mentre 
        uno troppo idratato non terrà la forma. Impara a riconoscere la consistenza giusta attraverso 
        l'esperienza.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Lievito madre non attivo</h2>
      <p class="mb-4">
        Utilizzare un lievito madre non sufficientemente attivo è un errore fatale. Prima di panificare, 
        assicurati che il tuo lievito abbia triplicato il volume dopo un rinfresco e che presenti una 
        struttura alveolata e profumata.
      </p>
    `,
  },
  "tecniche-impastamento": {
    title: "Tecniche di impastamento professionale",
    date: "28 Ottobre 2025",
    content: `
      <h2 class="text-2xl font-bold mt-8 mb-4">L'importanza della tecnica</h2>
      <p class="mb-4">
        L'impastamento non è solo mescolare ingredienti: è un processo che sviluppa la maglia glutinica, 
        determina la struttura finale del prodotto e influenza direttamente la lievitazione.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Metodo stretch and fold</h2>
      <p class="mb-4">
        Questa tecnica delicata è ideale per impasti ad alta idratazione. Consiste nel piegare l'impasto 
        su se stesso a intervalli regolari, sviluppando gradualmente la forza senza stress meccanico eccessivo.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Impastamento a mano vs impastatrice</h2>
      <p class="mb-4">
        L'impastamento a mano permette di sentire l'impasto e sviluppare sensibilità, ma richiede tempo 
        e tecnica. L'impastatrice è più efficiente ma richiede attenzione per non surriscaldare l'impasto.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Il punto di incordatura</h2>
      <p class="mb-4">
        Riconoscere il momento in cui l'impasto raggiunge il giusto sviluppo è fondamentale. L'impasto 
        deve essere elastico, liscio e non appiccicoso, capace di formare una membrana sottile senza rompersi.
      </p>
    `,
  },
  "temperatura-lievitazione": {
    title: "Il ruolo della temperatura",
    date: "20 Ottobre 2025",
    content: `
      <h2 class="text-2xl font-bold mt-8 mb-4">La temperatura è tutto</h2>
      <p class="mb-4">
        La temperatura influenza ogni aspetto della panificazione: dalla velocità di fermentazione 
        all'attività enzimatica, fino allo sviluppo del sapore e della struttura del pane.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Temperature dell'impasto</h2>
      <p class="mb-4">
        La temperatura finale dell'impasto è critica. Per la maggior parte dei pani, l'obiettivo è 
        26-28°C. Temperature più alte accelerano la fermentazione ma rischiano di produrre acidità 
        eccessiva.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Temperatura ambiente</h2>
      <p class="mb-4">
        L'ambiente di lievitazione ideale è tra 24-26°C. Temperature più basse rallentano il processo 
        ma migliorano lo sviluppo del sapore. Temperature più alte accelerano ma possono compromettere 
        la qualità.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Controllo della temperatura</h2>
      <p class="mb-4">
        Impara a calcolare la temperatura dell'acqua necessaria considerando la temperatura della farina, 
        dell'ambiente e l'attrito dell'impastamento. Usa un termometro per verificare sempre.
      </p>
    `,
  },
  "farine-per-panificazione": {
    title: "Guida alle farine per panificazione",
    date: "12 Ottobre 2025",
    content: `
      <h2 class="text-2xl font-bold mt-8 mb-4">Capire la forza della farina</h2>
      <p class="mb-4">
        La forza della farina, misurata in W, indica la capacità di assorbire acqua e trattenere gas. 
        Farine deboli (W 150-200) sono ideali per biscotti, medie (W 250-300) per pane comune, 
        forti (W 350+) per grandi lievitati.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Tipi di farina</h2>
      <p class="mb-4">
        La farina 00 è raffinata e delicata, la tipo 1 ha più fibra, la tipo 2 ancora di più, 
        l'integrale contiene tutto il chicco. La Manitoba è una farina forte ideale per impasti 
        che necessitano lunghe lievitazioni.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Idratazione</h2>
      <p class="mb-4">
        Farine diverse assorbono quantità diverse di acqua. Una farina forte può gestire idratazioni 
        del 70-80%, mentre una debole difficilmente supera il 55-60%. Impara a riconoscere la consistenza 
        giusta per ogni farina.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Scegliere la farina giusta</h2>
      <p class="mb-4">
        Per il pane quotidiano usa una farina media (W 260-280). Per la pizza una media-forte (W 280-320). 
        Per panettone e pandoro una forte Manitoba (W 350+). Per focacce e grissini una debole-media (W 200-250).
      </p>
    `,
  },
};

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [footerName, setFooterName] = useState("");
  const [footerEmail, setFooterEmail] = useState("");

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.rpc("upsert_email_lead", {
        p_email: footerEmail,
        p_nome: footerName,
        p_source: "footer_blog",
        p_has_footer_interaction: true,
      });

      if (error) throw error;

      toast({
        title: "Iscrizione completata!",
        description: "Ti contatteremo presto con aggiornamenti esclusivi.",
      });

      setFooterName("");
      setFooterEmail("");
    } catch (error) {
      console.error("Error submitting footer form:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    }
  };
  
  const article = slug ? blogArticles[slug as keyof typeof blogArticles] : null;

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Articolo non trovato</h1>
          <Button onClick={() => navigate("/")}>Torna alla home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src={logoImage} alt="Lievitista Logo" className="w-10 h-10 rounded-full object-cover" />
              <h1 className="text-xl font-bold text-foreground">Lievitista</h1>
            </div>
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Torna alla home
            </Button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="flex-1">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-4">{article.date}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{article.title}</h1>
          </div>
          
          <div 
            className="prose prose-lg max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-12 pt-8 border-t border-border/50">
            <Button onClick={() => navigate("/#blog")} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Torna al blog
            </Button>
          </div>
        </article>
      </main>

      <Footer 
        footerName={footerName}
        footerEmail={footerEmail}
        handleFooterSubmit={handleFooterSubmit}
        setFooterName={setFooterName}
        setFooterEmail={setFooterEmail}
      />
    </div>
  );
};

export default BlogArticle;
