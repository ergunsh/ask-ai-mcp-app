import type { QuestionConfig, SelectionState } from '../types';
import { QuestionHeader } from './QuestionHeader';
import { OptionList } from './OptionList';
import { OtherInput } from './OtherInput';

interface QuestionPanelProps {
  config: QuestionConfig;
  selection: SelectionState;
  onSelect: (value: string) => void;
  onOtherToggle: () => void;
  onOtherChange: (value: string) => void;
  onNext: () => void;
  focusedIndex?: number;
  nextIndex: number;
  isLastQuestion?: boolean;
}

export function QuestionPanel({
  config,
  selection,
  onSelect,
  onOtherToggle,
  onOtherChange,
  onNext,
  focusedIndex,
  nextIndex,
  isLastQuestion,
}: QuestionPanelProps) {
  const otherIndex = config.allowOther ? config.options.length : -1;
  const otherIsFocused = focusedIndex !== undefined && focusedIndex === otherIndex;
  const nextIsFocused = focusedIndex !== undefined && focusedIndex === nextIndex;

  return (
    <div className="animate-fade-in">
      <QuestionHeader header={config.header} question={config.question} />

      <div className="space-y-1.5">
        <OptionList
          options={config.options}
          selected={selection.selected}
          multiSelect={config.multiSelect}
          onSelect={onSelect}
          focusedIndex={focusedIndex !== undefined && focusedIndex < config.options.length ? focusedIndex : undefined}
        />

        {config.allowOther && (
          <OtherInput
            isSelected={selection.isOtherSelected}
            value={selection.otherText}
            multiSelect={config.multiSelect}
            onToggle={onOtherToggle}
            onChange={onOtherChange}
            focused={otherIsFocused}
          />
        )}
      </div>

      {/* Next/Review button - text link style for lighter feel */}
      <button
        type="button"
        onClick={onNext}
        className={`
          mt-4 w-full py-2.5 px-4 rounded-xl
          flex items-center justify-center gap-2
          text-base font-medium
          transition-all duration-150 ease-out
          ${nextIsFocused
            ? 'bg-surface-warm text-accent ring-2 ring-accent/30'
            : 'bg-surface-elevated hover:bg-surface-warm text-text-secondary hover:text-accent'
          }
        `}
      >
        <span>{isLastQuestion ? 'Review & Submit' : 'Continue'}</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
