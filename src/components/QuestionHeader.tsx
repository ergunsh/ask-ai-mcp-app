interface QuestionHeaderProps {
  header?: string;
  question: string;
}

export function QuestionHeader({ header, question }: QuestionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-text-primary leading-snug tracking-[-0.01em]">
        {question}
      </h2>
      {header && (
        <p className="mt-1 text-sm text-text-muted">
          {header}
        </p>
      )}
    </div>
  );
}
