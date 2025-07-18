import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DragDropGame } from "@/components/game/DragDropGame";
import { GameData } from "@/types/game";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";
import heroImage from "@/assets/math-hero.jpg";

const Index = () => {
  const [searchParams] = useSearchParams();
  const skillParam = searchParams.get('skill');
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  useEffect(() => {
    if (skillParam) {
      loadGameData(skillParam);
    }
  }, [skillParam]);

  const loadGameData = async (skill: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/data/skills/${skill}.json`);
      if (!response.ok) {
        throw new Error(`Skill "${skill}" not found`);
      }
      const data = await response.json();
      setGameData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game data');
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = (score: number) => {
    setFinalScore(score);
    setGameCompleted(true);
  };

  const handlePlayAgain = () => {
    setGameCompleted(false);
    setFinalScore(0);
  };

  // Landing page when no skill is specified
  if (!skillParam) {
    return (
      <div className="min-h-screen bg-gradient-game">
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          
          <div className="relative z-10 text-center animate-fade-in px-4">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6 leading-tight">
                MathMaster
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Master high school mathematics through interactive drag-and-drop games
              </p>
            </div>

            <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Direct Game Access
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>This app is designed to be accessed with a skill parameter.</p>
                <p className="mt-2 font-mono text-xs bg-muted p-2 rounded">
                  ?skill=quadratic-equations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-game flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading {skillParam}...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-game flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Game Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.history.back()} variant="outline" className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game interface
  if (gameData) {
    return (
      <div className="min-h-screen bg-gradient-game p-4">
        <div className="max-w-7xl mx-auto">
          {/* Game Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {gameData.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {gameData.description}
            </p>
          </div>

          {/* Game Completion Overlay */}
          {gameCompleted && (
            <Card className="mb-6 bg-card/90 backdrop-blur-sm border-primary">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Game Complete! 🎉
                  </h2>
                  <p className="text-3xl font-bold mb-4">{finalScore}%</p>
                  <Button onClick={handlePlayAgain} className="bg-gradient-primary">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Component */}
          <DragDropGame
            gameData={gameData}
            onComplete={handleGameComplete}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
