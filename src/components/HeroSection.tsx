import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Users, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-summer overflow-hidden animate-fade-in">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            ☀️ SummerUp 2025 Community Vote
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Dive into the sunshine and discover brilliant projects. Cast your vote
            for the Community Choice Award — one vote per IP to keep things fair.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="hero" size="lg" className="group" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              Vote Now
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="font-semibold">Your Voice Counts</h3>
              <p className="text-sm text-white/80 text-center">
                Help choose the Community Choice Award winner
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold">Fair Voting</h3>
              <p className="text-sm text-white/80 text-center">
                One vote per IP keeps the competition balanced
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="font-semibold">Live Tally</h3>
              <p className="text-sm text-white/80 text-center">
                See vote counts update in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;