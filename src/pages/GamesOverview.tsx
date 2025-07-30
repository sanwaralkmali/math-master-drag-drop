import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Target, Zap, Star, Trophy, PlayCircle } from "lucide-react";
import { MATHLOGAMEFooter } from "@/components/ui/mathlogame-footer";

const GamesOverview = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success text-success-foreground";
      case "Intermediate":
        return "bg-warning text-warning-foreground";
      case "Advanced":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-game flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Math Skills Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master high school mathematics through interactive games and
            challenges
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <div className="text-sm text-muted-foreground">
                Interactive Games
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">20+</div>
              <div className="text-sm text-muted-foreground">Math Skills</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-game-accent mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Learning Fun</div>
            </div>
          </div>
        </div>
      </div>
      <MATHLOGAMEFooter />
    </div>
  );
};

export default GamesOverview;
