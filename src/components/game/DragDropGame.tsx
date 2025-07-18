import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GameData, DragItem } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DragDropGameProps {
  gameData: GameData;
  onComplete: (score: number) => void;
  userName?: string;
}

export const DragDropGame = ({ gameData, onComplete, userName }: DragDropGameProps) => {
  const { toast } = useToast();
  
  // Initialize questions as draggable items
  const [questions] = useState<DragItem[]>(
    gameData.questions.map(q => ({
      id: q.id,
      content: q.content,
      originalCategory: q.correctCategory
    }))
  );

  // Track items in each category
  const [categoryItems, setCategoryItems] = useState<Record<string, DragItem[]>>(() => {
    const initial: Record<string, DragItem[]> = { 'questions': [...questions] };
    gameData.categories.forEach(cat => {
      initial[cat.id] = [];
    });
    return initial;
  });

  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    setCategoryItems(prev => {
      const newState = { ...prev };
      
      // Remove item from source
      const sourceItems = [...newState[source.droppableId]];
      const [movedItem] = sourceItems.splice(source.index, 1);
      newState[source.droppableId] = sourceItems;
      
      // Add item to destination
      const destItems = [...newState[destination.droppableId]];
      destItems.splice(destination.index, 0, movedItem);
      newState[destination.droppableId] = destItems;
      
      return newState;
    });
  }, []);

  const checkAnswers = () => {
    let correctCount = 0;
    const newFeedback: Record<string, boolean> = {};

    // Check each question's placement
    gameData.questions.forEach(question => {
      let isCorrect = false;
      
      // Find which category this question is currently in
      for (const [categoryId, items] of Object.entries(categoryItems)) {
        if (categoryId === 'questions') continue;
        
        const foundItem = items.find(item => item.id === question.id);
        if (foundItem) {
          isCorrect = categoryId === question.correctCategory;
          break;
        }
      }
      
      newFeedback[question.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setFeedback(newFeedback);
    const finalScore = Math.round((correctCount / gameData.questions.length) * 100);
    setScore(finalScore);
    setGameCompleted(true);

    // Show completion toast
    toast({
      title: finalScore >= 70 ? "Excellent!" : "Good try!",
      description: `You scored ${finalScore}% (${correctCount}/${gameData.questions.length} correct)`,
      duration: 5000,
    });

    onComplete(finalScore);
  };

  const resetGame = () => {
    setCategoryItems(() => {
      const initial: Record<string, DragItem[]> = { 'questions': [...questions] };
      gameData.categories.forEach(cat => {
        initial[cat.id] = [];
      });
      return initial;
    });
    setGameCompleted(false);
    setScore(0);
    setFeedback({});
  };

  const canCheck = Object.values(categoryItems).every(items => 
    items.length === 0 || categoryItems['questions'].length === 0
  ) && categoryItems['questions'].length === 0;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions Pool */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Questions
              <Badge variant="outline" className="ml-auto">
                {categoryItems['questions']?.length || 0}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Droppable droppableId="questions">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[300px] space-y-3 p-4 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-muted/30'
                  }`}
                >
                  {categoryItems['questions']?.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 bg-card border rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-all ${
                            snapshot.isDragging 
                              ? 'shadow-lg scale-105 rotate-2' 
                              : 'hover:shadow-md'
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {item.content}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {categoryItems['questions']?.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      All questions categorized! 🎉
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="lg:col-span-2 space-y-6">
          {gameData.categories.map((category) => (
            <Card key={category.id} className="border-l-4" style={{ borderLeftColor: `var(--${category.color})` }}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <span className="text-lg">{category.name}</span>
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      {category.description}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {categoryItems[category.id]?.length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={category.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[150px] space-y-3 p-4 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver 
                          ? `border-${category.color} bg-${category.color}/5` 
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      {categoryItems[category.id]?.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 bg-card border rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-all ${
                                snapshot.isDragging 
                                  ? 'shadow-lg scale-105 rotate-2' 
                                  : 'hover:shadow-md'
                              } ${
                                gameCompleted 
                                  ? feedback[item.id] 
                                    ? 'border-success bg-success/10' 
                                    : 'border-destructive bg-destructive/10'
                                  : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium flex-1">
                                  {item.content}
                                </div>
                                {gameCompleted && (
                                  <div className="ml-2">
                                    {feedback[item.id] ? (
                                      <CheckCircle className="w-5 h-5 text-success" />
                                    ) : (
                                      <XCircle className="w-5 h-5 text-destructive" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {categoryItems[category.id]?.length === 0 && !snapshot.isDraggingOver && (
                        <div className="text-center text-muted-foreground py-8 text-sm">
                          Drop {category.name.toLowerCase()} questions here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Game Controls */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-3">
          <Button
            onClick={checkAnswers}
            disabled={!canCheck || gameCompleted}
            className="bg-gradient-primary hover:bg-primary-glow"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Check Answers
          </Button>
          
          <Button
            onClick={resetGame}
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {gameCompleted && (
          <div className="text-right animate-fade-in">
            <div className="text-2xl font-bold text-primary mb-1">
              {score}%
            </div>
            <div className="text-sm text-muted-foreground">
              Final Score
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};