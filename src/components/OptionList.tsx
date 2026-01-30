import type { Option } from '../types';
import { OptionButton } from './OptionButton';

interface OptionListProps {
  options: Option[];
  selected: Set<string>;
  multiSelect: boolean;
  onSelect: (value: string) => void;
}

export function OptionList({ options, selected, multiSelect, onSelect }: OptionListProps) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <OptionButton
          key={option.value}
          option={option}
          isSelected={selected.has(option.value)}
          multiSelect={multiSelect}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
