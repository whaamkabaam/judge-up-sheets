import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";


const Header = () => {
  return (
    <header className="bg-gradient-card border-b shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sun className="h-8 w-8 text-primary" aria-hidden="true" />
            <span className="text-2xl font-bold text-primary">SummerUp Vote</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="hero" size="sm" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              Vote Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;