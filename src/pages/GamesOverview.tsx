import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Target, Zap, Star, Trophy, PlayCircle } from "lucide-react";

// All math skills - only 5 have drag-and-drop games
const mathSkills = [
  {
    id: "linear-equations",
    title: "Linear Equations",
    description: "Solve and categorize different types of linear equations",
    difficulty: "Beginner",
    icon: Brain,
    hasGame: true,
    gameType: "drag-drop"
  },
  {
    id: "quadratic-functions",
    title: "Quadratic Functions",
    description: "Identify and categorize quadratic function properties",
    difficulty: "Intermediate",
    icon: Target,
    hasGame: true,
    gameType: "drag-drop"
  },
  {
    id: "trigonometry",
    title: "Trigonometry",
    description: "Match trigonometric identities and equations",
    difficulty: "Advanced",
    icon: Zap,
    hasGame: true,
    gameType: "drag-drop"
  },
  {
    id: "derivatives",
    title: "Derivatives",
    description: "Categorize derivative rules and applications",
    difficulty: "Advanced",
    icon: Star,
    hasGame: true,
    gameType: "drag-drop"
  },
  {
    id: "probability",
    title: "Probability",
    description: "Sort probability concepts and calculations",
    difficulty: "Intermediate",
    icon: Trophy,
    hasGame: true,
    gameType: "drag-drop"
  },
  // Skills without games yet
  {
    id: "geometry",
    title: "Geometry",
    description: "Basic geometric shapes and properties",
    difficulty: "Beginner",
    icon: Brain,
    hasGame: false
  },
  {
    id: "statistics",
    title: "Statistics",
    description: "Data analysis and statistical measures",
    difficulty: "Intermediate",
    icon: Target,
    hasGame: false
  }
];

const GamesOverview = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success text-success-foreground";
      case "Intermediate": return "bg-warning text-warning-foreground";
      case "Advanced": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-game">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Math Skills Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master high school mathematics through interactive games and challenges
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mathSkills.map((skill, index) => (
            <Card 
              key={skill.id} 
              className={`group transition-all duration-300 hover:shadow-game hover:-translate-y-1 ${
                skill.hasGame ? "border-primary/20 hover:border-primary/40" : "opacity-75"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <skill.icon className={`h-8 w-8 ${skill.hasGame ? "text-primary" : "text-muted-foreground"}`} />
                  <Badge className={getDifficultyColor(skill.difficulty)}>
                    {skill.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {skill.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {skill.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                {skill.hasGame ? (
                  <Link to={`/games/${skill.id}`}>
                    <Button className="w-full group-hover:bg-primary-glow transition-colors">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Play Game
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Coming Soon
                  </Button>
                )}
                
                {skill.gameType && (
                  <div className="mt-3 flex items-center text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Drag & Drop Game
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <div className="text-sm text-muted-foreground">Interactive Games</div>
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
    </div>
  );
};

export default GamesOverview;