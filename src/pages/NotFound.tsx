import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <Breadcrumbs items={[{ label: "404 - Stranica nije pronađena" }]} />
          
          <div className="text-center animate-fade-in-up">
            <h1 className="text-9xl font-bold text-gradient-primary mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Stranica nije pronađena
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
              Izvinjavamo se, ali stranica koju tražite ne postoji ili je premeštena.
            </p>
            <Link to="/">
              <Button size="lg" className="gap-2">
                <Home className="w-5 h-5" />
                Nazad na početnu
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
