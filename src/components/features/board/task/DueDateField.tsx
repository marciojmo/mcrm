import { Input } from '@/components/ui/Input';

interface DueDateFieldProps {
  value: string | null;
  onChange: (dueDate: string | null) => void;
}

export function DueDateField({ value, onChange }: DueDateFieldProps) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      Prazo
      <Input
        type="date"
        max="9999-12-31"
        className="w-40"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || null)}
      />
    </label>
  );
}
