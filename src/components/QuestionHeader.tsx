interface QuestionHeaderProps {
  header?: string;
  question: string;
}

export function QuestionHeader({ header, question }: QuestionHeaderProps) {
  return (
    <div className="mb-4">
      {header && (
        <span className="inline-block px-2 py-1 mb-2 text-xs font-medium rounded-full bg-primary/10 text-primary">
          {header}
        </span>
      )}
      <h2 className="text-lg font-semibold text-text-primary">{question}</h2>
    </div>
  );
}
