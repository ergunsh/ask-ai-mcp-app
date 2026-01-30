interface SubmitButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export function SubmitButton({ disabled, onClick }: SubmitButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      autoFocus
      className={`
        w-full py-3 px-4 rounded-xl font-medium text-base
        transition-all duration-150 ease-out
        focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-surface
        ${disabled
          ? 'bg-surface-elevated text-text-muted cursor-not-allowed'
          : 'bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-md active:scale-[0.99]'
        }
      `}
    >
      <span className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Submit Answers
      </span>
    </button>
  );
}
