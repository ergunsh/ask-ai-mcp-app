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
      className={`
        w-full mt-4 px-4 py-3 rounded-lg font-medium transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-primary/30
        ${disabled
          ? 'bg-surface-secondary text-text-secondary cursor-not-allowed'
          : 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98]'
        }
      `}
    >
      Submit
    </button>
  );
}
