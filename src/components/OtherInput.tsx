import { useRef } from 'react';

interface OtherInputProps {
  isSelected: boolean;
  value: string;
  multiSelect: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  focused?: boolean;
}

export function OtherInput({ isSelected, value, multiSelect, onToggle, onChange, focused }: OtherInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevIsSelectedRef = useRef(isSelected);

  // Track if we just toggled (imperatively)
  const justToggled = isSelected && !prevIsSelectedRef.current;
  prevIsSelectedRef.current = isSelected;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    } else if (e.key === 'Tab') {
      inputRef.current?.blur();
      // Don't preventDefault - let useTabNavigation handle it
    }
    // All other keys (including arrow keys) pass through normally for text editing
  };

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={onToggle}
        className={`
          group w-full px-4 py-3 text-left rounded-xl
          transition-all duration-150 ease-out
          ${isSelected
            ? 'bg-selected-bg border border-selected-border shadow-sm'
            : 'bg-surface hover:bg-surface-elevated border border-transparent hover:border-border'
          }
          ${focused ? 'ring-2 ring-accent/30 ring-offset-1 ring-offset-surface' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          {/* Selection indicator */}
          <div className={`
            flex-shrink-0 w-[18px] h-[18px]
            flex items-center justify-center
            transition-all duration-150 ease-out
            ${multiSelect ? 'rounded-[5px]' : 'rounded-full'}
            ${isSelected
              ? 'bg-accent border-0'
              : 'border-[1.5px] border-text-muted/40 group-hover:border-text-secondary'
            }
          `}>
            {isSelected && (
              multiSelect ? (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="w-[6px] h-[6px] bg-white rounded-full" />
              )
            )}
          </div>

          <span className={`
            text-base font-medium
            transition-colors duration-150
            ${isSelected ? 'text-text-primary' : 'text-text-primary/90 group-hover:text-text-primary'}
          `}>
            Other
          </span>
        </div>
      </button>

      {/* Text input shown when "Other" is selected */}
      {isSelected && (
        <div className="mt-2 ml-[42px] animate-fade-in">
          <input
            ref={(el) => {
              inputRef.current = el;
              // Focus imperatively only when "Other" is first toggled on
              if (el && justToggled) {
                el.focus();
              }
            }}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            className="
              w-full px-3 py-2 text-base rounded-lg
              bg-surface-elevated border border-border
              text-text-primary placeholder-text-muted
              focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
              transition-all duration-150
            "
          />
        </div>
      )}
    </div>
  );
}
