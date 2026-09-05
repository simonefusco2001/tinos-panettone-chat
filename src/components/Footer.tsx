import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import logoImage from "@/assets/logo.jpg";

interface FooterProps {
  footerName: string;
  setFooterName: (name: string) => void;
  footerEmail: string;
  setFooterEmail: (email: string) => void;
  handleFooterSubmit: (e: React.FormEvent) => void;
}

const Footer = ({ footerName, setFooterName, footerEmail, setFooterEmail, handleFooterSubmit }: FooterProps) => {
  return (
    <footer className="border-t border-border/50 bg-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Lievitista Logo" className="w-10 h-10 rounded-full object-cover" />
              <h3 className="text-2xl font-bold text-foreground">Lievitista</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Lievitista nasce da un gruppo di appassionati che vogliono rendere la panificazione casalinga più
              consapevole e accessibile.
            </p>
            <Link
              to="/chi-siamo"
              className="text-primary hover:text-primary/80 font-medium transition-colors inline-block"
            >
              Chi siamo
            </Link>
          </div>

          {/* Right Column - Newsletter Form */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Non perdere l'accesso da Starter</h3>
              <p className="text-muted-foreground">
                Blocca il prezzo più basso per sempre ed entra subito nel gruppo privato Facebook.
              </p>
            </div>

            <form onSubmit={handleFooterSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Il tuo nome"
                value={footerName}
                onChange={(e) => setFooterName(e.target.value)}
                className="bg-background border-border"
                maxLength={100}
                required
              />
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="tua@email.it"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  className="bg-background border-border pl-10"
                  maxLength={255}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full text-white font-semibold bg-primary">
                Iscriviti
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">© 2025 Lievitista. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;