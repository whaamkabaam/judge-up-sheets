import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Users, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-hero overflow-hidden animate-fade-in">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to <span className="text-primary-glow">JudgeUp</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            The ultimate platform for hackathon judging and community voting. 
            Streamline your event management with powerful tools for judges, 
            organizers, and participants.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="hero" size="lg" className="group">
              Explore Projects
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="premium" size="lg">
              Join as Judge
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="font-semibold">Smart Judging</h3>
              <p className="text-sm text-white/80 text-center">
                Custom rubrics and weighted scoring for fair evaluation
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold">Community Voice</h3>
              <p className="text-sm text-white/80 text-center">
                Engage the community with public voting and feedback
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="font-semibold">Easy Management</h3>
              <p className="text-sm text-white/80 text-center">
                Import from Google Sheets and manage everything in one place
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;