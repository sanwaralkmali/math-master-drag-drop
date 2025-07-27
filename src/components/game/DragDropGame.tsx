import { useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GameData, DragItem } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowDown,
  Target,
  Hand,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface DragDropGameProps {
  gameData: GameData;
  onComplete: (score: number) => void;
  userName?: string;
}

export const DragDropGame = ({
  gameData,
  onComplete,
  userName,
}: DragDropGameProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Initialize questions as draggable items
  const [questions] = useState<DragItem[]>(
    gameData.questions.map((q) => ({
      id: q.id,
      content: q.content,
      originalCategory: q.correctCategory,
    }))
  );

  // Track items in each category
  const [categoryItems, setCategoryItems] = useState<
    Record<string, DragItem[]>
  >(() => {
    const initial: Record<string, DragItem[]> = { questions: [...questions] };
    gameData.categories.forEach((cat) => {
      initial[cat.id] = [];
    });
    return initial;
  });

  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    setCategoryItems((prev) => {
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

  // Simple tap-to-move function for kids
  const handleItemTap = useCallback(
    (itemId: string, targetCategory: string) => {
      setCategoryItems((prev) => {
        const newState = { ...prev };

        // Find which category the item is currently in
        let sourceCategory = "questions";
        for (const [categoryId, items] of Object.entries(newState)) {
          if (items.find((item) => item.id === itemId)) {
            sourceCategory = categoryId;
            break;
          }
        }

        // If item is already in target category, move it back to questions
        if (sourceCategory === targetCategory) {
          targetCategory = "questions";
        }

        // Remove from source
        const sourceItems = newState[sourceCategory].filter(
          (item) => item.id !== itemId
        );
        newState[sourceCategory] = sourceItems;

        // Add to target
        const item = questions.find((q) => q.id === itemId);
        if (item) {
          newState[targetCategory] = [...newState[targetCategory], item];
        }

        return newState;
      });

      setSelectedItem(null);
    },
    [questions]
  );

  const checkAnswers = () => {
    let correctCount = 0;
    const newFeedback: Record<string, boolean> = {};

    // Check each question's placement
    gameData.questions.forEach((question) => {
      let isCorrect = false;

      // Find which category this question is currently in
      for (const [categoryId, items] of Object.entries(categoryItems)) {
        if (categoryId === "questions") continue;

        const foundItem = items.find((item) => item.id === question.id);
        if (foundItem) {
          isCorrect = categoryId === question.correctCategory;
          break;
        }
      }

      newFeedback[question.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setFeedback(newFeedback);
    const finalScore = Math.round(
      (correctCount / gameData.questions.length) * 100
    );
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
      const initial: Record<string, DragItem[]> = { questions: [...questions] };
      gameData.categories.forEach((cat) => {
        initial[cat.id] = [];
      });
      return initial;
    });
    setGameCompleted(false);
    setScore(0);
    setFeedback({});
    setSelectedItem(null);
  };

  const canCheck =
    Object.values(categoryItems).every(
      (items) => items.length === 0 || categoryItems["questions"].length === 0
    ) && categoryItems["questions"].length === 0;

  // Ultra-simple tap interface for very young kids
  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* Questions Pool - Tap to select */}
        <Card className="w-full border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-blue-700">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Questions ({categoryItems["questions"]?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="min-h-[60px] flex flex-wrap gap-2 p-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-100/50">
              {categoryItems["questions"]?.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setSelectedItem(selectedItem === item.id ? null : item.id)
                  }
                  className={`px-3 py-2 bg-white border-2 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md ${
                    selectedItem === item.id
                      ? "border-blue-500 bg-blue-100 shadow-lg scale-105"
                      : "border-blue-200 hover:border-blue-300"
                  }`}
                >
                  {item.content}
                </button>
              ))}

              {categoryItems["questions"]?.length === 0 && (
                <div className="text-center text-muted-foreground py-2 text-xs w-full">
                  All sorted! 🎉
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories - Tap to move selected item */}
        <div className="grid grid-cols-1 gap-3">
          {gameData.categories.map((category, index) => {
            const colors = [
              "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50",
              "border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50",
              "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50",
              "border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50",
            ];
            const textColors = [
              "text-green-700",
              "text-purple-700",
              "text-orange-700",
              "text-pink-700",
            ];
            const iconColors = [
              "text-green-500",
              "text-purple-500",
              "text-orange-500",
              "text-pink-500",
            ];

            return (
              <Card
                key={category.id}
                className={`border-2 ${colors[index % colors.length]}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Target
                        className={`w-3 h-3 ${
                          iconColors[index % iconColors.length]
                        }`}
                      />
                      <span className={textColors[index % textColors.length]}>
                        {category.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-white/80">
                      {categoryItems[category.id]?.length || 0}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div
                    className={`min-h-[50px] flex flex-wrap gap-2 p-2 rounded-lg border-2 border-dashed ${
                      index === 0
                        ? "border-green-300 bg-green-100/50"
                        : index === 1
                        ? "border-purple-300 bg-purple-100/50"
                        : index === 2
                        ? "border-orange-300 bg-orange-100/50"
                        : "border-pink-300 bg-pink-100/50"
                    }`}
                  >
                    {categoryItems[category.id]?.map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          setSelectedItem(
                            selectedItem === item.id ? null : item.id
                          )
                        }
                        className={`px-3 py-2 bg-white border-2 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md ${
                          selectedItem === item.id
                            ? "border-blue-500 bg-blue-100 shadow-lg scale-105"
                            : "border-gray-200 hover:border-gray-300"
                        } ${
                          gameCompleted
                            ? feedback[item.id]
                              ? "border-green-500 bg-green-100"
                              : "border-red-500 bg-red-100"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span>{item.content}</span>
                          {gameCompleted && (
                            <div>
                              {feedback[item.id] ? (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-600" />
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}

                    {categoryItems[category.id]?.length === 0 && (
                      <div className="text-center text-muted-foreground py-2 text-xs w-full">
                        <ArrowDown className="w-3 h-3 mx-auto mb-1 opacity-50" />
                        Tap to move here
                      </div>
                    )}
                  </div>

                  {/* Move button for selected item */}
                  {selectedItem && (
                    <button
                      onClick={() => handleItemTap(selectedItem, category.id)}
                      className={`mt-2 w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 shadow-md hover:shadow-lg ${
                        index === 0
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                          : index === 1
                          ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600"
                          : index === 2
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                          : "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600"
                      }`}
                    >
                      <Hand className="w-3 h-3" />
                      Move here
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Game Controls - Compact */}
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <Button
              onClick={checkAnswers}
              disabled={!canCheck || gameCompleted}
              className="flex-1 py-2 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Check
            </Button>

            <Button
              onClick={resetGame}
              variant="outline"
              className="flex-1 py-2 text-xs border-2 border-gray-300 hover:border-gray-400 bg-white shadow-md hover:shadow-lg"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          {gameCompleted && (
            <div className="text-center animate-fade-in bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-xl border-2 border-green-200 shadow-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {score}%
              </div>
              <div className="text-xs text-green-700 font-medium">
                Final Score
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout (simplified)
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Questions Pool */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Questions
                <Badge variant="outline" className="ml-auto">
                  {categoryItems["questions"]?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="questions">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] space-y-2 p-3 rounded-lg border-2 border-dashed transition-colors ${
                      snapshot.isDraggingOver
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {categoryItems["questions"]?.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-2 bg-card border rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-all text-sm ${
                                snapshot.isDragging
                                  ? "shadow-lg scale-105 rotate-2"
                                  : "hover:shadow-md"
                              }`}
                            >
                              <div className="font-medium text-center">
                                {item.content}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}

                    {categoryItems["questions"]?.length === 0 && (
                      <div className="text-center text-muted-foreground py-6">
                        All questions categorized! 🎉
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          {/* Categories - Compact and Colorful */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
            {gameData.categories.map((category, index) => {
              const colors = [
                "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50",
                "border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50",
                "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50",
                "border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50",
              ];
              const textColors = [
                "text-green-700",
                "text-purple-700",
                "text-orange-700",
                "text-pink-700",
              ];
              const iconColors = [
                "text-green-500",
                "text-purple-500",
                "text-orange-500",
                "text-pink-500",
              ];

              return (
                <Card
                  key={category.id}
                  className={`border-2 ${colors[index % colors.length]}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Target
                          className={`w-3 h-3 ${
                            iconColors[index % iconColors.length]
                          }`}
                        />
                        <span className={textColors[index % textColors.length]}>
                          {category.name}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs bg-white/80">
                        {categoryItems[category.id]?.length || 0}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Droppable droppableId={category.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[80px] space-y-1 p-2 rounded-lg border-2 border-dashed transition-colors ${
                            snapshot.isDraggingOver
                              ? `border-${category.color} bg-${category.color}/5`
                              : index === 0
                              ? "border-green-300 bg-green-100/50"
                              : index === 1
                              ? "border-purple-300 bg-purple-100/50"
                              : index === 2
                              ? "border-orange-300 bg-orange-100/50"
                              : "border-pink-300 bg-pink-100/50"
                          }`}
                        >
                          {categoryItems[category.id]?.map(
                            (item, itemIndex) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={itemIndex}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-1.5 bg-white border rounded shadow-sm cursor-grab active:cursor-grabbing transition-all text-xs ${
                                      snapshot.isDragging
                                        ? "shadow-lg scale-105 rotate-2"
                                        : "hover:shadow-md"
                                    } ${
                                      gameCompleted
                                        ? feedback[item.id]
                                          ? "border-green-500 bg-green-100"
                                          : "border-red-500 bg-red-100"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="font-medium flex-1">
                                        {item.content}
                                      </div>
                                      {gameCompleted && (
                                        <div className="ml-1">
                                          {feedback[item.id] ? (
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                          ) : (
                                            <XCircle className="w-3 h-3 text-red-600" />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          )}
                          {provided.placeholder}

                          {categoryItems[category.id]?.length === 0 &&
                            !snapshot.isDraggingOver && (
                              <div className="text-center text-muted-foreground py-2 text-xs">
                                Drop {category.name.toLowerCase()} questions
                                here
                              </div>
                            )}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Game Controls */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              onClick={checkAnswers}
              disabled={!canCheck || gameCompleted}
              className="bg-gradient-primary hover:bg-primary-glow"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Check Answers
            </Button>

            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {gameCompleted && (
            <div className="text-right animate-fade-in">
              <div className="text-2xl font-bold text-primary mb-1">
                {score}%
              </div>
              <div className="text-sm text-muted-foreground">Final Score</div>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};
