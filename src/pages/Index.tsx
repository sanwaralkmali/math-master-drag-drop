import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DragDropGame } from "@/components/game/DragDropGame";
import { GameData } from "@/types/game";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";
import heroImage from "@/assets/math-hero.jpg";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const skillParam = searchParams.get("skill");
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [userName, setUserName] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [timer, setTimer] = useState(0);
  const [numQuestions, setNumQuestions] = useState(12);
  const [originalQuestions, setOriginalQuestions] = useState<
    GameData["questions"]
  >([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (skillParam) {
      loadGameData(skillParam);
    }
  }, [skillParam, numQuestions]);

  useEffect(() => {
    if (showGame) {
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showGame]);

  const loadGameData = async (skill: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/data/skills/${skill}.json`);
      if (!response.ok) {
        throw new Error(`Skill "${skill}" not found`);
      }
      const data = await response.json();
      // Store original questions for re-randomization
      setOriginalQuestions(data.questions);
      // Randomly select numQuestions questions if more than numQuestions
      let questions = data.questions;
      if (Array.isArray(questions) && questions.length > numQuestions) {
        questions = questions
          .map((q) => ({ q, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .slice(0, numQuestions)
          .map(({ q }) => q);
      }
      setGameData({ ...data, questions });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load game data");
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = (score: number) => {
    setFinalScore(score);
    setGameCompleted(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handlePlayAgain = () => {
    setGameCompleted(false);
    setFinalScore(0);
    setTimer(0);
    // Re-randomize questions from the original full list
    if (
      originalQuestions.length > 0 &&
      originalQuestions.length > numQuestions
    ) {
      const questions = originalQuestions
        .map((q) => ({ q, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .slice(0, numQuestions)
        .map(({ q }) => q);
      setGameData((prev) => (prev ? { ...prev, questions } : null));
    }
    setShowGame(false);
    setTimeout(() => setShowGame(true), 0); // Restart game
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
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6 leading-tight">
                MathMaster
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed px-4">
                Master high school mathematics through interactive drag-and-drop
                games
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
                <p>
                  This app is designed to be accessed with a skill parameter.
                </p>
                <p className="mt-2 font-mono text-xs bg-muted p-2 rounded">
                  ?skill=classification-numbers
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
            <Button
              onClick={() => window.history.back()}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg border-0 transition-all duration-200 transform hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pre-interface before game starts
  if (skillParam && gameData && !showGame) {
    // Fake leaderboard data
    const leaderboard = [];
    return (
      <div className="min-h-screen bg-gradient-game flex flex-col items-center justify-center relative">
        <div className="flex-1 flex flex-col justify-center w-full items-center">
          <Card className="w-full max-w-md mx-4 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                {gameData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-base">
                  Enter your name:
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-base">
                  Choose number of questions:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[8, 12, 16, 24].map((n) => (
                    <Button
                      key={n}
                      type="button"
                      variant={numQuestions === n ? "default" : "outline"}
                      className={`py-2 text-sm ${
                        numQuestions === n ? "bg-primary text-white" : ""
                      }`}
                      onClick={() => setNumQuestions(n)}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full py-3 text-base"
                  disabled={!userName}
                  onClick={() => setShowGame(true)}
                >
                  Start the Game
                </Button>
                {/* Leaderboard Button and Dialog */}
                <Button
                  className="w-full py-3 text-base"
                  variant="outline"
                  onClick={() => setShowLeaderboard(true)}
                >
                  Leaderboard
                </Button>
                <Dialog
                  open={showLeaderboard}
                  onOpenChange={setShowLeaderboard}
                >
                  <DialogContent className="max-w-md mx-4">
                    <DialogHeader>
                      <DialogTitle className="text-xl">
                        Leaderboard - {gameData.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <table className="w-full text-left">
                        <thead>
                          <tr>
                            <th className="py-2 text-lg">Name</th>
                            <th className="py-2 text-lg">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.map((entry, idx) => (
                            <tr
                              key={idx}
                              className={
                                entry.highlight ? "font-bold text-primary" : ""
                              }
                            >
                              <td className="py-2 text-base">{entry.name}</td>
                              <td className="py-2 text-base">{entry.score}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <DialogClose asChild>
                      <Button className="mt-4 w-full py-3 text-lg">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                {/* How to Play Button and Dialog */}
                <Button
                  className="w-full py-3 text-base"
                  variant="outline"
                  onClick={() => {
                    console.log("Opening How to play the game dialog");
                    setShowInstructions(true);
                  }}
                >
                  How to play the game
                </Button>
                <Dialog
                  open={showInstructions}
                  onOpenChange={(open) => {
                    console.log("Dialog onOpenChange", open);
                    setShowInstructions(open);
                  }}
                >
                  <DialogContent className="max-w-md mx-4">
                    <DialogHeader>
                      <DialogTitle className="text-xl">How to Play</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-base">
                      <ul className="list-disc pl-5 space-y-3 text-left">
                        {(gameData && Array.isArray(gameData.instructions)
                          ? gameData.instructions
                          : ["No instructions available for this skill."]
                        ).map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                      <div className="mt-4 font-semibold text-lg">
                        Good luck and have fun learning!
                      </div>
                    </DialogDescription>
                    <DialogClose asChild>
                      <Button className="mt-4 w-full py-3 text-lg">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Footer at the bottom */}
        <footer className="w-full py-4 text-center text-sm text-muted-foreground border-t bg-background font-cairo mt-auto absolute bottom-0 left-0">
          <div className="container mx-auto">
            <p>
              Educational Game 2025 | Created for Educational purposes By{" "}
              <Link
                to="https://sanwaralkmali.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Salah Alkmali
              </Link>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Game interface
  if (gameData && showGame) {
    return (
      <div className="min-h-screen bg-gradient-game p-2 sm:p-4 font-cairo relative overflow-hidden">
        {/* Fun math game background elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Colorful geometric shapes */}
          <div className="absolute left-8 top-8 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute right-12 top-24 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg opacity-20 animate-pulse"></div>
          <div
            className="absolute left-1/3 top-1/3 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-15 animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute right-1/4 bottom-16 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg opacity-20 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute left-1/4 bottom-24 w-18 h-18 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-15 animate-bounce"
            style={{ animationDelay: "1.5s" }}
          ></div>

          {/* Fun math symbols with colors */}
          <div
            className="absolute left-16 top-32 text-4xl opacity-25 select-none animate-pulse"
            style={{ color: "#3B82F6" }}
          >
            +
          </div>
          <div
            className="absolute right-24 top-16 text-3xl opacity-25 select-none animate-bounce"
            style={{ color: "#10B981" }}
          >
            ×
          </div>
          <div
            className="absolute left-1/2 top-1/2 text-5xl opacity-20 select-none animate-pulse"
            style={{ color: "#F59E0B" }}
          >
            ÷
          </div>
          <div
            className="absolute right-1/3 bottom-8 text-4xl opacity-25 select-none animate-bounce"
            style={{ color: "#EF4444" }}
          >
            =
          </div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Game Header - Clean mobile layout */}
          <div className="mb-4 font-cairo">
            {/* Top row: Back button and title */}
            <div className="flex items-center justify-between mb-3">
              <Button
                onClick={() => setShowGame(false)}
                className="font-cairo text-xs px-3 py-1 h-7 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg border-0 rounded-md transition-all duration-200 transform hover:scale-105 flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Back
              </Button>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent text-center flex-1">
                {gameData.title}
              </h1>
              <div className="w-16"></div> {/* Spacer for balance */}
            </div>

            {/* Bottom row: Player info and timer */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="font-medium">
                Player:{" "}
                <span className="text-primary font-semibold">{userName}</span>
              </div>
              <div className="font-medium">
                Time:{" "}
                <span className="text-primary font-semibold">
                  {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
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
                  <Button
                    onClick={handlePlayAgain}
                    className="bg-gradient-primary"
                  >
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
            userName={userName}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
