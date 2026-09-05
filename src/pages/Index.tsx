import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TinoChat from "@/components/TinoChat";
import Footer from "@/components/Footer";
import logoImage from "@/assets/logo.jpg";
import tinoIcon from "@/assets/tino-logo.jpeg";
import tinoMascotFull from "@/assets/tino-mascot-full.png";
import tinoMascotWave from "@/assets/tino-mascot-wave.png";
import sourdough1 from "@/assets/sourdough-1.png";
import sourdough2 from "@/assets/sourdough-2.png";
import sourdough3 from "@/assets/sourdough-3.png";
import tinoCorner1 from "@/assets/tino-corner-1.png";
import tinoCorner2 from "@/assets/tino-corner-2.png";
import tinoCorner3 from "@/assets/tino-corner-3.png";
import tinoCorner4 from "@/assets/tino-corner-4.png";
import facebookStarterGroup from "@/assets/facebook-starter-group.png";
import diarioLievito1 from "@/assets/diario-lievito-1.jpg";
import diarioLievito2 from "@/assets/diario-lievito-2.png";
import diarioLievito3 from "@/assets/diario-lievito-3.png";
import { MessageSquare, BookOpen, Newspaper, Search, Clock, HelpCircle, X, Check, Users, CreditCard, MessageCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Blog articles data
const blogArticles = [
  {
    slug: "come-gestire-il-lievito-madre",
    title: "Come gestire il lievito madre",
    description: "Scopri tutti i segreti per mantenere il tuo lievito madre sano e attivo. Temperature, tempi di rinfresco e molto altro.",
    icon: BookOpen,
    gradient: "from-primary/20 to-accent/20"
  },
  {
    slug: "il-primo-panettone",
    title: "Il tuo primo panettone",
    description: "Guida passo-passo per realizzare il tuo primo panettone perfetto. Dalla preparazione alla cottura.",
    icon: Newspaper,
    gradient: "from-accent/20 to-primary/20"
  },
  {
    slug: "errori-comuni-lievitazione",
    title: "Errori comuni nella lievitazione",
    description: "Impara a riconoscere e correggere gli errori più frequenti per ottenere risultati perfetti ogni volta.",
    icon: HelpCircle,
    gradient: "from-primary/20 to-secondary/30"
  },
  {
    slug: "tecniche-impastamento",
    title: "Tecniche di impastamento professionale",
    description: "Scopri le tecniche usate dai panificatori professionisti per ottenere impasti perfettamente sviluppati.",
    icon: BookOpen,
    gradient: "from-accent/20 to-secondary/20"
  },
  {
    slug: "temperatura-lievitazione",
    title: "Il ruolo della temperatura",
    description: "Come la temperatura influenza la lievitazione e come controllarla per risultati costanti.",
    icon: Clock,
    gradient: "from-primary/20 to-accent/30"
  },
  {
    slug: "farine-per-panificazione",
    title: "Guida alle farine per panificazione",
    description: "Tutte le farine spiegate: forza, idratazione e quale usare per ogni tipo di prodotto.",
    icon: Newspaper,
    gradient: "from-secondary/20 to-primary/20"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [isChatActive, setIsChatActive] = useState(false);
  const [isChatEmailDialogOpen, setIsChatEmailDialogOpen] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatEmail, setChatEmail] = useState("");
  const [isDiaryDialogOpen, setIsDiaryDialogOpen] = useState(false);
  const [diaryName, setDiaryName] = useState("");
  const [diaryEmail, setDiaryEmail] = useState("");
  const [acceptStarterGroup, setAcceptStarterGroup] = useState(false);
  const [footerName, setFooterName] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [starterName, setStarterName] = useState("");
  const [starterEmail, setStarterEmail] = useState("");
  const [activeCard, setActiveCard] = useState(1); // 0=left, 1=center, 2=right
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleArticles, setVisibleArticles] = useState(3);
  const starterSectionRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const {
    toast
  } = useToast();

  // Load saved email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("lievitista_user_email");
    if (savedEmail) {
      setChatEmail(savedEmail);
      setDiaryEmail(savedEmail);
      setFooterEmail(savedEmail);
      setStarterEmail(savedEmail);
    }
  }, []);

  // Scroll to section based on hash in URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Scroll-based animation for starter section images
  useEffect(() => {
    if (prefersReducedMotion) {
      setScrollProgress(0);
      return;
    }
    const handleScroll = () => {
      if (!starterSectionRef.current) return;
      const section = starterSectionRef.current;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Section hasn't been scrolled enough yet
      if (rect.bottom > viewportHeight * 0.5) {
        setScrollProgress(0);
        return;
      }

      // Section has completely scrolled past
      if (rect.bottom < -viewportHeight * 0.5) {
        setScrollProgress(0);
        return;
      }

      // Start effect only when section bottom reaches middle of viewport
      // Progress from 0 to 1 as section scrolls from bottom-middle to top
      const triggerPoint = viewportHeight * 0.5;
      const scrollDistance = triggerPoint + viewportHeight * 0.5;
      const currentScroll = triggerPoint - rect.bottom;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollDistance));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReducedMotion]);
  const scrollToHero = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("hero")?.scrollIntoView({
      behavior: "smooth"
    });
  };
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth"
    });
  };
  const handleChatEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatName.trim()) {
      toast({
        title: "Nome mancante",
        description: "Inserisci il tuo nome.",
        variant: "destructive"
      });
      return;
    }
    if (chatEmail && chatEmail.includes("@")) {
      try {
        const {
          error
        } = await supabase.rpc('upsert_email_lead', {
          p_email: chatEmail,
          p_nome: chatName,
          p_source: 'chat',
          p_has_chat_interaction: true
        });
        if (error) throw error;

        // Save to localStorage
        localStorage.setItem("lievitista_user_email", chatEmail);
        localStorage.setItem("lievitista_email_timestamp", new Date().toISOString());
        setIsChatEmailDialogOpen(false);
        setIsChatActive(true);
        setChatName("");
        setChatEmail("");
        toast({
          title: "Benvenuto!",
          description: "Inizia a chattare con Tino."
        });

        // Smooth scroll alla chat dopo aver inserito l'email
        setTimeout(() => {
          document.getElementById("hero")?.scrollIntoView({
            behavior: "smooth"
          });
        }, 100);
      } catch (error) {
        console.error("Error in handleChatEmailSubmit:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore. Riprova.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive"
      });
    }
  };
  const handleDiaryEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryName.trim()) {
      toast({
        title: "Nome mancante",
        description: "Inserisci il tuo nome.",
        variant: "destructive"
      });
      return;
    }
    if (diaryEmail && diaryEmail.includes("@")) {
      try {
        const {
          error
        } = await supabase.rpc('upsert_email_lead', {
          p_email: diaryEmail,
          p_nome: diaryName,
          p_source: 'diary',
          p_has_diary_interaction: true
        });
        if (error) throw error;

        // Save to localStorage
        localStorage.setItem("lievitista_user_email", diaryEmail);
        localStorage.setItem("lievitista_email_timestamp", new Date().toISOString());
        toast({
          title: "Grazie per il tuo interesse!",
          description: "Ti contatteremo non appena la funzione sarà disponibile."
        });
        setDiaryName("");
        setDiaryEmail("");
        setIsDiaryDialogOpen(false);
      } catch (error) {
        console.error("Error in handleDiaryEmailSubmit:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore. Riprova.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive"
      });
    }
  };
  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerName.trim()) {
      toast({
        title: "Nome mancante",
        description: "Inserisci il tuo nome.",
        variant: "destructive"
      });
      return;
    }
    if (!footerEmail.trim() || !footerEmail.includes("@")) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive"
      });
      return;
    }
    try {
      const {
        error
      } = await supabase.rpc('upsert_email_lead', {
        p_email: footerEmail,
        p_nome: footerName,
        p_source: 'footer-newsletter',
        p_has_footer_interaction: true
      });
      if (error) throw error;

      // Save to localStorage
      localStorage.setItem("lievitista_user_email", footerEmail);
      localStorage.setItem("lievitista_email_timestamp", new Date().toISOString());
      toast({
        title: "Grazie per esserti iscritto!",
        description: "Riceverai presto l'accesso al gruppo privato Facebook."
      });
      setFooterName("");
      setFooterEmail("");
    } catch (error) {
      console.error("Error in handleFooterSubmit:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive"
      });
    }
  };
  const handleStarterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!starterName.trim()) {
      toast({
        title: "Nome mancante",
        description: "Inserisci il tuo nome.",
        variant: "destructive"
      });
      return;
    }
    if (!starterEmail.trim() || !starterEmail.includes("@")) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive"
      });
      return;
    }
    try {
      const {
        error
      } = await supabase.rpc('upsert_email_lead', {
        p_email: starterEmail,
        p_nome: starterName,
        p_source: 'starter-early-access',
        p_has_starter_interaction: true
      });
      if (error) throw error;

      // Save to localStorage
      localStorage.setItem("lievitista_user_email", starterEmail);
      localStorage.setItem("lievitista_email_timestamp", new Date().toISOString());
      toast({
        title: "Benvenuto tra gli Starter!",
        description: "Riceverai presto l'accesso al gruppo privato e alla guida PDF."
      });
      setStarterName("");
      setStarterEmail("");
    } catch (error) {
      console.error("Error in handleStarterSubmit:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-8">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Lievitista Logo" className="w-10 h-10 rounded-full object-cover" />
              <a href="#hero" onClick={scrollToHero} className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                Lievitista
              </a>
            </div>

            {/* Navigation Chips */}
            <div className="hidden md:flex gap-3">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-lg transition-all duration-300 px-5 py-2.5 text-sm font-medium flex items-center gap-2" onClick={() => scrollToSection("assistente")}>
                <MessageSquare className="w-4 h-4" />
                Assistente digitale
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-lg transition-all duration-300 px-5 py-2.5 text-sm font-medium flex items-center gap-2" onClick={() => scrollToSection("diario")}>
                <BookOpen className="w-4 h-4" />
                Diario del lievito
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-lg transition-all duration-300 px-5 py-2.5 text-sm font-medium flex items-center gap-2" onClick={() => scrollToSection("blog")}>
                <Newspaper className="w-4 h-4" />
                Blog
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-lg transition-all duration-300 px-5 py-2.5 text-sm font-medium flex items-center gap-2" onClick={() => scrollToSection("faq")}>
                <HelpCircle className="w-4 h-4" />
                FAQ
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Radial Gradient Background - Semi-luna dal basso */}
        <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 140% 100% at 50% 100%, 
                 hsl(var(--primary) / 0.35) 0%, 
                 hsl(var(--accent) / 0.28) 20%,
                 hsl(var(--primary) / 0.20) 40%,
                 hsl(var(--accent) / 0.12) 60%,
                 hsl(var(--background)) 85%)`
      }}>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Centered Content */}
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-top duration-700">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight drop-shadow-sm text-center lg:text-7xl">
                Dai dubbi <span className="text-primary">al</span> <span className="text-accent">profumo del tuo primo panettone</span>
              </h1>

              <h2 className="text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto md:text-3xl">
                Tino è il tuo lievitista digitale: ti dice cosa serve, quando serve, senza calcoli complicati
              </h2>
            </div>

            {/* Chat - Rectangular shape */}
            <div className="max-w-4xl mx-auto h-[600px] animate-in fade-in slide-in-from-bottom duration-700">
              {!isChatActive ? <div className="h-full bg-background/95 backdrop-blur-md rounded-3xl border border-border/30 shadow-elevated flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center overflow-hidden shadow-soft">
                  <img src={tinoIcon} alt="Tino mascotte" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Incontra Tino</h3>
                <p className="text-foreground/70 max-w-sm">Il tuo assistente personale per la panificazione.</p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <Button size="lg" onClick={() => setIsChatEmailDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated w-full h-12 text-base font-medium rounded-full">
                    Inizia a Chattare con Tino
                  </Button>
                </div>
              </div> : <div className="h-full bg-background/95 backdrop-blur-md rounded-3xl border border-border/30 shadow-elevated overflow-hidden">
                <TinoChat />
              </div>}
            </div>
          </div>
        </div>
      </section>

      {/* Tino Mascot with Tooltip */}
      <div className="container mx-auto px-4 py-8 relative">
        <div className="max-w-6xl mx-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute -top-24 right-8 hidden md:block cursor-pointer hover:scale-110 transition-transform duration-300 z-10 animate-slide-in-right">
                  <img src={tinoMascotWave} alt="Tino mascotte" className="w-72 h-72 object-contain drop-shadow-lg" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-elevated">
                Ciao, sono Tino!
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Problems Section */}
      <section className="container mx-auto px-4 py-16 border-t border-border/50">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ti riconosci in questi <span className="text-primary">problemi</span>?
            </h2>
            <p className="text-lg text-muted-foreground">
              Non sei solo: l'80% dei principianti abbandona il lievito madre nei primi 3 mesi.
            </p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-8 md:overflow-visible scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {/* Card 1 */}
            <div className={`bg-card rounded-xl border p-8 space-y-6 transition-all duration-300 ease-out cursor-pointer snap-center flex-shrink-0 w-[85vw] md:w-auto ${activeCard === 0 ? 'md:scale-110 z-10 border-primary/50 shadow-[0_0_40px_hsl(var(--primary)/0.35)]' : 'md:scale-90 shadow-soft z-0 md:opacity-80 border-border/50'}`} onMouseEnter={() => setActiveCard(0)} onFocus={() => setActiveCard(0)} onTouchStart={() => setActiveCard(0)} tabIndex={0} role="article" aria-label="Card: Non so se il mio lievito è sano">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-[#f7f0ea]">
                <Search className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground text-center">Non so se il mio lievito è sano</h3>
              <p className="text-muted-foreground text-center text-sm leading-relaxed">
                Non raddoppia, ha un odore strano, non so se è pronto per l'impasto. Ogni rinfresco è un'incertezza: ho
                paura di rovinare ore di lavoro.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">Ore sui forum senza trovare risposte chiare</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-600">
                    Analisi guidata dello stato del lievito e soluzioni immediate
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className={`bg-card rounded-xl border p-8 space-y-6 transition-all duration-300 ease-out cursor-pointer snap-center flex-shrink-0 w-[85vw] md:w-auto ${activeCard === 1 ? 'md:scale-110 z-10 border-primary/50 shadow-[0_0_40px_hsl(var(--primary)/0.35)]' : 'md:scale-90 shadow-soft z-0 md:opacity-80 border-border/50'}`} onMouseEnter={() => setActiveCard(1)} onFocus={() => setActiveCard(1)} onTouchStart={() => setActiveCard(1)} tabIndex={0} role="article" aria-label="Card: Non riesco a stare dietro ai rinfreschi">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground text-center">
                Non riesco a stare dietro ai rinfreschi
              </h3>
              <p className="text-muted-foreground text-center text-sm leading-relaxed">
                Tra tutti gli impegni, mi dimentico di rinfrescare. Il lievito si indebolisce e mi sento in colpa per
                averlo 'trascurato'.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">Routine rigide che non si adattano alla vita vera</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-600">
                    Diario automatico che traccia tutto e promemoria visivi in app
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className={`bg-card rounded-xl border p-8 space-y-6 transition-all duration-300 ease-out cursor-pointer snap-center flex-shrink-0 w-[85vw] md:w-auto ${activeCard === 2 ? 'md:scale-110 z-10 border-primary/50 shadow-[0_0_40px_hsl(var(--primary)/0.35)]' : 'md:scale-90 shadow-soft z-0 md:opacity-80 border-border/50'}`} onMouseEnter={() => setActiveCard(2)} onFocus={() => setActiveCard(2)} onTouchStart={() => setActiveCard(2)} tabIndex={0} role="article" aria-label="Card: Non so più a chi credere, troppe informazioni">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground text-center">
                Non so più a chi credere, troppe informazioni
              </h3>
              <p className="text-muted-foreground text-center text-sm leading-relaxed">
                Licoli, lievito solido, in acqua... ogni metodo dice cose diverse. Sono più confuso di prima e non so da
                dove iniziare.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">
                    Informazioni frammentate tra blog, YouTube, gruppi Facebook
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-600">
                    Protocolli verificati in un unico posto più libreria filtrata per livello
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-8">
            <p className="text-lg md:text-xl font-medium">
              <span className="text-primary">
                Da <em>"non so se è pronto"</em> a <em>"questo l'ho fatto io"</em>: Tino ti accompagna dal dubbio al tuo
                primo successo.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Starter Section */}
      <section ref={starterSectionRef} className="container mx-auto px-4 py-16 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-br from-card via-card to-accent/5 border border-border/50 p-8 md:p-12">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              {/* Left Column - Content */}
              <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Diventa uno Starter di Lievitista</h2>
                  <p className="text-lg text-muted-foreground">
                    Accedi all'<span className="font-semibold text-primary">anteprima</span>, entra nel{" "}
                    <span className="font-semibold text-primary">gruppo privato</span> Facebook e blocca il{" "}
                    <span className="font-semibold text-primary">prezzo Starter</span> per sempre.
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    <p className="text-foreground font-medium">Accesso immediato al gruppo Facebook privato</p>
                  </div>
                  <div className="flex items-start gap-3">
                    
                    
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    <p className="text-foreground font-medium">Accesso anticipato prima del lancio pubblico</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-foreground font-medium">Prezzo bloccato a vita</p>
                      <p className="text-sm text-muted-foreground mt-1">Solo 100 posti disponibili : Scadenza: 1 Gennaio</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    <p className="text-foreground font-medium">Voce attiva: voti mensili sulle funzioni da sviluppare</p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleStarterSubmit} className="space-y-4 max-w-md">
                  <Input type="text" placeholder="Il tuo nome" value={starterName} onChange={e => setStarterName(e.target.value)} className="bg-background border-border" maxLength={100} required />
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="tua@email.it" value={starterEmail} onChange={e => setStarterEmail(e.target.value)} className="bg-background border-border pl-10" maxLength={255} required />
                  </div>
                  <Button type="submit" size="lg" className="w-full text-white font-semibold bg-primary">
                    Diventa uno Starter
                  </Button>
                </form>

                {/* Bottom Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-background/50 rounded-lg border border-border/50 p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-sm text-foreground font-medium">Posti limitati fino a quando non rilasciamo l'app</p>
                  </div>

                  <div className="bg-background/50 rounded-lg border border-border/50 p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-sm text-foreground font-medium">Nessun pagamento richiesto</p>
                  </div>

                  <div className="bg-background/50 rounded-lg border border-border/50 p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-sm text-foreground font-medium">Supporto costante della community</p>
                  </div>
                </div>

                {/* Facebook Group Image - Mobile Only */}
                <div className="flex lg:hidden items-center justify-center mt-8">
                  <img 
                    src={facebookStarterGroup} 
                    alt="Gruppo Facebook Starter di Lievitista" 
                    className="w-full max-w-md rounded-lg shadow-soft border border-border/30"
                  />
                </div>
              </div>

              {/* Right Column - Facebook Group Image - Desktop Only */}
              <div className="hidden lg:flex items-center justify-center">
                <img 
                  src={facebookStarterGroup} 
                  alt="Gruppo Facebook Starter di Lievitista" 
                  className="w-80 rounded-lg shadow-soft border border-border/30 opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Scroll-triggered image cards */}
        {!prefersReducedMotion}
      </section>

      {/* Assistente Digitale Section */}
      <section id="assistente" className="container mx-auto px-4 py-16 border-t border-border/50 relative">
        {/* Tino Corner Characters */}
        <TooltipProvider>
          {/* Top Left - No tooltip */}
          <div className="hidden md:block absolute top-4 left-4 w-32 h-32 z-10">
            <img src={tinoCorner1} alt="Tino mascotte" className="w-full h-full object-contain drop-shadow-lg" />
          </div>

          {/* Top Right - No tooltip */}
          <div className="hidden md:block absolute top-4 right-4 w-32 h-32 z-10">
            <img src={tinoCorner2} alt="Tino mascotte" className="w-full h-full object-contain drop-shadow-lg" />
          </div>

          {/* Bottom Left */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="hidden md:block absolute bottom-4 left-4 w-32 h-32 cursor-pointer hover:scale-110 transition-transform duration-300 z-10">
                <img src={tinoCorner3} alt="Tino mascotte" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-elevated">
              Prepariamo il lievito insieme!
            </TooltipContent>
          </Tooltip>

          {/* Bottom Right */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="hidden md:block absolute bottom-4 right-4 w-32 h-32 cursor-pointer hover:scale-110 transition-transform duration-300 z-10">
                <img src={tinoCorner4} alt="Tino mascotte" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-elevated">
              Prepariamo il lievito insieme!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Tino: il tuo primo assistente sul lievito</h2>
          <p className="text-lg text-muted-foreground text-center">
            <strong>Interpreta e correggi il tuo lievito:</strong> non sai se è troppo acido, debole o pronto? Tino
            analizza stato, odore, aspetto e ti dice esattamente cosa fare per recuperarlo.
          </p>
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-8 mt-8 md:overflow-visible scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="text-center space-y-3 p-6 rounded-lg bg-card/50 border border-border/50 snap-center flex-shrink-0 w-[85vw] md:w-auto">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Risposte in 3 minuti. Non in 3 giorni.</h3>
              <p className="text-sm text-muted-foreground">
                Descrivi aspetto, odore e comportamento del lievito. Tino identifica lo stato e restituiscre il
                protocollo di recupero.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-lg bg-card/50 border border-border/50 snap-center flex-shrink-0 w-[85vw] md:w-auto">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Zero interpretazioni. Solo sequenze operative.</h3>
              <p className="text-sm text-muted-foreground">
                Ogni risposta include parametri misurabili. Tino non improvvisa: attinge da informazioni validate e casi
                documentati. Se cercare online ti confonde, Tino di dà una risposta chiara.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-lg bg-card/50 border border-border/50 snap-center flex-shrink-0 w-[85vw] md:w-auto">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Da diagnonsi rapida a supporto continuativo</h3>
              <p className="text-sm text-muted-foreground">
                Il gruppo Starter di dà supporto diretto: persone vere che paificano come te e che hanno affrontato i
                tuoi dubbi e problemi. Tino è il consulto rapido. Il gruppo è dove impari davvero.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm" onClick={() => navigate("/tino-chat")}>
              Parla con Tino
            </Button>
          </div>

          {/* Tino Mascot Image */}
          <div className="mt-12 flex justify-center">
            
          </div>
        </div>
      </section>

      {/* Tino Mascot Between Sections - Mobile Only */}
      <div className="container mx-auto px-4 py-8 relative lg:hidden">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-40 h-40 cursor-pointer hover:scale-110 transition-transform duration-300 z-10 animate-slide-in-right">
                <img src={tinoMascotWave} alt="Tino mascotte" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-elevated">
              Ciao io sono Tino!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Diario del Lievito Section */}
      <section id="diario" className="container mx-auto px-4 py-16 border-t border-border/50 bg-secondary/10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border-[1.5px]" style={{
              background: "rgba(212, 165, 116, 0.08)",
              borderColor: "rgba(212, 165, 116, 0.4)"
            }}>
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              <span className="text-accent text-[11px] font-medium">In sviluppo</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Diario del Lievito</h2>
              <p className="text-lg text-muted-foreground">
                <strong>Il tuo laboratorio personale. Con Tino sempre al tuo fianco.</strong>
              </p>
              
              <div className="p-8 rounded-2xl border shadow-sm" style={{
                background: "#FFFDFB",
                borderColor: "rgba(212, 165, 116, 0.2)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
              }}>
                <BookOpen className="w-10 h-10 mb-5" style={{
                  color: "#D4A574",
                  opacity: 0.3
                }} />
                <p className="text-base" style={{
                  color: "#5A5A5A",
                  lineHeight: "1.8"
                }}>
                  Registra foto, odore, temperature, tempi di raddoppio e note per ogni rinfresco o panificazione. Salva
                  ricette, esperimenti e risultati. Tutto in un posto, sempre disponibile. Tino analizza i tuoi dati nel
                  tempo: ti aiuta a capire cosa ha funzionato, ti consiglia quando sei in dubbio e ti avvisa se rileva
                  pattern di errore ricorrenti. Così ogni volta che panifichi, sai esattamente da dove ripartire e cosa
                  aspettarti.
                </p>
              </div>

              <div className="flex justify-center md:justify-start pt-4">
                <Button size="lg" variant="outline" className="bg-transparent border-2 font-semibold px-10 py-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" style={{
                  borderColor: "#dda23c",
                  color: "#3D3D3D"
                }} onMouseEnter={e => {
                  e.currentTarget.style.background = "#dda23c";
                  e.currentTarget.style.color = "#FFFFFF";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(212, 165, 116, 0.25)";
                }} onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#3D3D3D";
                  e.currentTarget.style.boxShadow = "";
                }} onClick={() => setIsDiaryDialogOpen(true)}>
                  Avvisami quando è pronto
                </Button>
              </div>
            </div>

            {/* Right Column - Image Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Image - Spans 2 columns */}
              <Card className="col-span-2 overflow-hidden border-border/30 shadow-soft transition-all duration-300 hover:shadow-elevated hover:scale-[1.02]">
                <img 
                  src={diarioLievito1} 
                  alt="Registrazione dati del lievito" 
                  className="w-full h-64 object-cover"
                />
              </Card>

              {/* Second Image - Left column */}
              <Card className="overflow-hidden border-border/30 shadow-soft transition-all duration-300 hover:shadow-elevated hover:scale-[1.02]">
                <img 
                  src={diarioLievito2} 
                  alt="Spirale di pasta lievitata" 
                  className="w-full h-48 object-cover"
                />
              </Card>

              {/* Third Image - Right column */}
              <Card className="overflow-hidden border-border/30 shadow-soft transition-all duration-300 hover:shadow-elevated hover:scale-[1.02]">
                <img 
                  src={diarioLievito3} 
                  alt="Lievito madre in ciotola" 
                  className="w-full h-48 object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Email Dialog */}
      <Dialog open={isChatEmailDialogOpen} onOpenChange={setIsChatEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inserisci i tuoi dati</DialogTitle>
            <DialogDescription>Per iniziare a chattare con Tino, inserisci il tuo nome e indirizzo email.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChatEmailSubmit} className="space-y-4">
            <Input type="text" placeholder="Il tuo nome" value={chatName} onChange={e => setChatName(e.target.value)} maxLength={100} required />
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="tua@email.it" value={chatEmail} onChange={e => setChatEmail(e.target.value)} className="pl-10" maxLength={255} required />
            </div>
            <Button type="submit" className="w-full">
              Inizia a Chattare
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diary Dialog */}
      <Dialog open={isDiaryDialogOpen} onOpenChange={setIsDiaryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Funzionalità in arrivo</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Ti avvisiamo appena è pronto. Nel frattempo, entra nel gruppo Starter: prezzo bloccato a Lievitista quando
              lanciamo, protocolli di recupero già disponibili, supporto diretto e un gruppo vivo di persone con la tua
              passione.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDiaryEmailSubmit} className="space-y-4 pt-4">
            <Input type="text" placeholder="Il tuo nome" value={diaryName} onChange={e => setDiaryName(e.target.value)} maxLength={100} required />
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="tua@email.it" value={diaryEmail} onChange={e => setDiaryEmail(e.target.value)} className="pl-10" maxLength={255} required />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="starter-group" checked={acceptStarterGroup} onCheckedChange={checked => setAcceptStarterGroup(checked as boolean)} />
              <label htmlFor="starter-group" className="text-sm font-bold text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Voglio accedere al gruppo starter
              </label>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Invia
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Blog Section */}
      <section id="blog" className="container mx-auto px-4 py-16 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Blog</h2>
            <p className="text-lg text-muted-foreground">
              <strong>Impara la teoria e mettila in pratica:</strong> guide complete su acidità, equilibrio e temperature.
              Ricette filtrate per difficoltà: dal pane semplice ai grandi lievitati.
            </p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-8 mb-8 md:overflow-visible scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {blogArticles.slice(0, visibleArticles).map((article) => {
              const IconComponent = article.icon;
              return (
                <Card 
                  key={article.slug}
                  className="overflow-hidden border-border/30 shadow-soft transition-all duration-300 hover:shadow-elevated hover:scale-[1.02] cursor-pointer snap-center flex-shrink-0 w-[85vw] md:w-auto"
                  onClick={() => navigate(`/blog/${article.slug}`)}
                >
                  <div className={`h-48 bg-gradient-to-br ${article.gradient} flex items-center justify-center`}>
                    <IconComponent className="w-16 h-16 text-primary/40" />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-foreground">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.description}
                    </p>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Leggi l'articolo →
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {visibleArticles < blogArticles.length && (
            <div className="flex justify-center">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 font-semibold px-10 py-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  borderColor: "#dda23c",
                  color: "#3D3D3D"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#dda23c";
                  e.currentTarget.style.color = "#FFFFFF";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(212, 165, 116, 0.25)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#3D3D3D";
                  e.currentTarget.style.boxShadow = "";
                }}
                onClick={() => setVisibleArticles(prev => Math.min(prev + 3, blogArticles.length))}
              >
                Continua a leggere
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Domande Frequenti</h2>
              <p className="text-muted-foreground text-lg">Risposte alle domande più comuni su Lievitista e Tino</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-primary/15 border border-primary/30 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  Ma l'app non è ancora pronta…
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Esatto. E questo ti dà un vantaggio concreto: influenzi lo sviluppo.
                  <br />I primi 100 membri del gruppo Starter testano per primi i protocolli, indicano le funzioni da
                  priorizzare e ottengono l'accesso all'app con un <strong>pagamento unico ridotto</strong>.<br />
                  Quando l'app sarà pubblica, il prezzo sarà più alto e non ci sarà più voce in capitolo sulle scelte
                  tecniche.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-primary/15 border border-primary/30 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  Ok, ma nella pratica come funziona?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Carichi una foto del lievito.
                  <br />
                  Tino analizza aspetto, odore (che descrivi tu) e stato generale.
                  <br />
                  Ti restituisce un protocollo operativo:
                  <br />
                  <strong>"Rinfresco 1:2:45%, farina W300+, 26–28°C per 4 ore."</strong>
                  <br />
                  Ogni rinfresco viene tracciato con foto e dati reali.
                  <br />
                  Dopo 3–4 cicli riconosce il comportamento del tuo lievito e segnala quando sta per uscire dai
                  parametri.
                  <br />
                  Niente interpretazioni: esegui la sequenza e il lievito torna stabile.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-primary/15 border border-primary/30 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  Come so che i vostri protocolli funzionano davvero?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A settembre 2025, Simone ha recuperato un lievito madre in condizioni critiche combinando:
                  <ul className="list-disc pl-5 mt-2 mb-2 space-y-1">
                    <li>tecnica maturata in anni di corsi sui lievitati,</li>
                    <li>decine di test pratici,</li>
                    <li>
                      e un GPT sperimentale sviluppato da lui per analizzare pattern, tempi e parametri del lievito.
                    </li>
                  </ul>
                  Stiamo traducendo tutte le risorse apprese in una versione solida, pubblica e disponibile a tutti.
                  Richiede tempo di validazione e ottimizzazione delle risorse, ed è esattamente la direzione in cui
                  stiamo andando.
                  <br />
                  <br />
                  Da lì nasce Lievitista: dai protocolli che hanno funzionato sul campo, non da teoria astratta o da
                  laboratorio.
                  <br />
                  Quello che oggi diamo allo Starter è la versione manuale e verificata di quegli stessi metodi.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-primary/15 border border-primary/30 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  Perché dovrei imparare da voi invece che cercare online?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Online trovi casi generici.
                  <br />
                  Tino lavora sul tuo lievito, non su quello di altri.
                  <br />
                  Un tutorial ti dice "rinfresca quando raddoppia".
                  <br />
                  Un Lievitista ti dice:
                  <br />
                  <strong>
                    "Il tuo lievito, nelle condizioni attuali, richiede un rinfresco 1:2:45% a 28°C per 4 ore."
                  </strong>
                  <br />
                  La differenza è semplice:
                  <br />
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Online trovi tanti scenari possibili.</li>
                    <li>Tino analizza il tuo lievito e adatta il protocollo alle sue caratteristiche.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-primary/15 border border-primary/30 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  Quando posso iniziare a usare Tino?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <strong>Subito.</strong> Tino è già disponibile in anteprima.
                  <br />
                  <br />
                  <strong>Cosa può fare ora?</strong> Ti aiuta a iniziare un lievito madre, mantenerlo vivo e
                  ottimizzare i rinfreschi. Ti dà protocolli testati e spunti pratici per i problemi più comuni. Non è
                  ancora al massimo delle sue capacità (analisi completa dei pattern, diagnosi automatiche), ma è già
                  utile per partire con il piede giusto.
                  <br />
                  <br />
                  <strong>E il gruppo Starter?</strong> È la community Facebook di Lievitista. Qui trovi:
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Altri panificatori che condividono esperienze e si aiutano.</li>
                    <li>Voce diretta sullo sviluppo: decidi con noi quali funzioni costruire.</li>
                    <li>Supporto immediato quando Tino ancora non basta</li>
                  </ul>
                  <br />
                  <br />
                  <strong>Perché entrare ora?</strong> Prezzo scontato (pagamento unico) + partecipi alle decisioni sul
                  prodotto. Dopo il lancio pubblico: prezzo più alto, feature già fissate.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-primary/15 border border-primary/30 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  Cosa succede dopo i primi 100 posti?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Chiudiamo l'accesso Starter fino all'uscita dell'app.
                  <br />
                  Motivo semplice: forniamo supporto diretto e oltre 100 persone renderebbero impossibile mantenere
                  qualità e tempi di risposta.
                  <br />
                  Chi arriverà dopo il lancio troverà l'app completa, ma con prezzo standard e senza partecipare allo
                  sviluppo.
                  <br />I primi 100 mantengono uno status permanente: pagamento unico ridotto, gruppo riservato,
                  priorità sulle nuove funzioni.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-primary/15 border border-primary/30 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  E se poi Tino non fa per me?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Nel gruppo Starter hai già protocolli, guide diagnostiche e supporto diretto.
                  <br />
                  Anche senza l'app risolvi i problemi del lievito con metodi verificati.
                  <br />
                  Tino non sostituisce la tecnica: la automatizza.
                  <br />
                  Il valore è nei protocolli, non nell'interfaccia.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="bg-primary/15 border border-primary/30 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  Cos'è esattamente il gruppo Starter?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  È una community tecnica dove chi panifica si aiuta a vicenda per correggere e stabilizzare il proprio
                  lievito madre.
                  <br />
                  Ogni membro può:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>condividere foto e parametri</li>
                    <li>chiedere diagnosi</li>
                    <li>confrontare tempi di raddoppio</li>
                    <li>testare protocolli prima degli altri</li>
                    <li>dare input sullo sviluppo dell'app</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer footerName={footerName} setFooterName={setFooterName} footerEmail={footerEmail} setFooterEmail={setFooterEmail} handleFooterSubmit={handleFooterSubmit} />
    </div>;
};
export default Index;