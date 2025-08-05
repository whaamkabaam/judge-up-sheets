import { Button } from "@/components/ui/button";
import { Gavel, Users, Vote, Settings } from "lucide-react";
import { Link } from "react-router-dom";

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
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Projects
            </button>
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Community Vote
            </button>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/judge">
                <Users className="h-4 w-4 mr-2" />
                Judge Portal
              </Link>
            </Button>
            <Button variant="admin" size="sm" asChild>
              <a href="/admin">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;