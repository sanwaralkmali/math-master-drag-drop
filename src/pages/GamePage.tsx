import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DragDropGame } from "@/components/game/DragDropGame";
import { GameData } from "@/types/game";

const GamePage = () => {
  const { skillSlug } = useParams<{ skillSlug: string }>();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Dynamic import of JSON data based on skill slug
        const response = await fetch(`/data/skills/${skillSlug}.json`);
        
        if (!response.ok) {
          throw new Error(`Game data not found for ${skillSlug}`);
        }
        
        const data = await response.json();
        setGameData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game data');
      } finally {
        setLoading(false);
      }
    };

    if (skillSlug) {
      loadGameData();
    }
  }, [skillSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-game flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="min-h-screen bg-gradient-game flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/games">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-game">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <Link to="/games">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {gameData.title.toUpperCase()}
              </h1>
              <p className="text-muted-foreground">
                {gameData.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>~5 min</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <span>{gameData.questions.length} questions</span>
            </div>
          </div>
        </div>

        {/* Game Component */}
        <div className="animate-slide-in">
          <DragDropGame 
            gameData={gameData}
            onComplete={(score) => {
              console.log('Game completed with score:', score);
              // Here you could save the score, show completion screen, etc.
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;