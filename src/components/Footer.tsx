import { Facebook, Twitter, Github, MapPin, Phone, Rss } from "lucide-react";
import { useLocation } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const handleNavClick = (sectionId: string) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      // If we're on home page, smooth scroll to section
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-gradient-primary mb-4">
              selo Šebet
            </h3>
            <p className="text-muted-foreground mb-4">
              Dokumentarni sajt o našem selu — čuvamo priče i tradiciju za buduće
              generacije.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/seloSebet"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" style={{ color: '#1877F2' }} />
              </a>
              <a
                href="https://x.com/seloschebet"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                aria-label="X (Twitter)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@schebet_selo"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://github.com/schebet/schebet"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                aria-label="Github"
              >
                <Github className="w-5 h-5 text-[#181717] dark:text-white" />
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                aria-label="RSS Feed"
              >
                <Rss className="w-5 h-5" style={{ color: '#FF6600' }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-foreground">Brzi linkovi</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNavClick('home')} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Početna
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('blog')} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('gallery')} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Galerija
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  O selu
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-foreground">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>selo Šebet, Opština XYZ</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+381 123 456 789</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>© {currentYear} selo Šebet. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  );
};
