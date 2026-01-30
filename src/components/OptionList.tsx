import type { Option } from '../types';
import { OptionButton } from './OptionButton';

interface OptionListProps {
  options: Option[];
  selected: Set<string>;
  multiSelect: boolean;
  onSelect: (value: string) => void;
  focusedIndex?: number;
}

export function OptionList({ options, selected, multiSelect, onSelect, focusedIndex }: OptionListProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {options.map((option, index) => (
        <OptionButton
          key={option.value}
          option={option}
          isSelected={selected.has(option.value)}
          multiSelect={multiSelect}
          onSelect={onSelect}
          focused={focusedIndex === index}
        />
      ))}
    </div>
  );
}
