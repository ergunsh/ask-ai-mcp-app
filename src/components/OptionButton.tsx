import type { Option } from '../types';

interface OptionButtonProps {
  option: Option;
  isSelected: boolean;
  multiSelect: boolean;
  onSelect: (value: string) => void;
  focused?: boolean;
}

export function OptionButton({ option, isSelected, multiSelect, onSelect, focused }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
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
      <div className="flex items-start gap-3">
        {/* Selection indicator - refined circle/checkbox */}
        <div className={`
          mt-0.5 flex-shrink-0 w-[18px] h-[18px]
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

        {/* Option content */}
        <div className="flex-1 min-w-0 -mt-px">
          <div className={`
            text-base font-medium leading-snug
            transition-colors duration-150
            ${isSelected ? 'text-text-primary' : 'text-text-primary/90 group-hover:text-text-primary'}
          `}>
            {option.label}
          </div>
          {option.description && (
            <div className={`
              mt-0.5 text-sm leading-snug
              transition-colors duration-150
              ${isSelected ? 'text-text-secondary' : 'text-text-muted group-hover:text-text-secondary'}
            `}>
              {option.description}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
