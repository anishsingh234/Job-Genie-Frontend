import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface QuestionCardProps {
  questionIndex: number;
  totalQuestions: number;
  question: string;
  category?: string;
}

export function QuestionCard({
  questionIndex,
  totalQuestions,
  question,
  category,
}: QuestionCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary-light text-sm font-heading font-bold">
            {questionIndex + 1}
          </span>
          <span className="text-sm text-text-secondary">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
        </div>
        {category && <Badge variant="primary">{category}</Badge>}
      </div>
      <p className="text-lg font-heading font-semibold text-text-primary leading-relaxed">
        {question}
      </p>
    </Card>
  );
}
