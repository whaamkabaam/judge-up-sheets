import { Button } from "@/components/ui/button";
import { Gavel, Users, Vote, Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-card border-b shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gavel className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">JudgeUp</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">
              Projects
            </a>
            <a href="#vote" className="text-muted-foreground hover:text-primary transition-colors">
              Community Vote
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Judge Portal
            </Button>
            <Button variant="admin" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;