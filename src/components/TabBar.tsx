import type { QuestionConfig } from '../types';

interface TabBarProps {
  questions: QuestionConfig[];
  activeTab: string;
  answeredQuestions: Set<string>;
  onTabChange: (questionOrSubmit: string) => void;
}

export function TabBar({ questions, activeTab, answeredQuestions, onTabChange }: TabBarProps) {
  const isOnSubmit = activeTab === 'submit';
  const currentIndex = questions.findIndex(q => q.question === activeTab);
  const progress = answeredQuestions.size;
  const total = questions.length;

  return (
    <div className="mb-5">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-0.5 bg-border-subtle rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
        <span className="text-xs text-text-muted tabular-nums">
          {progress}/{total}
        </span>
      </div>

      {/* Tab pills */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, index) => {
          const isActive = activeTab === q.question;
          const isAnswered = answeredQuestions.has(q.question);
          const isPast = index < currentIndex || (isOnSubmit && index < questions.length);

          return (
            <button
              key={q.question}
              onClick={() => onTabChange(q.question)}
              className={`
                relative px-3 py-1.5 text-sm font-medium rounded-pill
                transition-all duration-150 ease-out
                ${isActive
                  ? 'bg-accent text-white shadow-sm'
                  : isAnswered
                    ? 'bg-selected-bg text-text-primary hover:bg-surface-warm'
                    : 'bg-surface-elevated text-text-secondary hover:bg-surface-warm hover:text-text-primary'
                }
              `}
            >
              <span className="flex items-center gap-1.5">
                {isAnswered && !isActive && (
                  <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {q.header}
              </span>
            </button>
          );
        })}

        {/* Submit pill */}
        <button
          onClick={() => onTabChange('submit')}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-pill
            transition-all duration-150 ease-out
            ${isOnSubmit
              ? 'bg-accent text-white shadow-sm'
              : 'bg-surface-elevated text-text-secondary hover:bg-surface-warm hover:text-text-primary'
            }
          `}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Submit
          </span>
        </button>
      </div>
    </div>
  );
}
