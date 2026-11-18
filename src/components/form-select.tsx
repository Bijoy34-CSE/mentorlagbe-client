interface FormSelectProps {
  id: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}

export function FormSelect({ id, value, options, placeholder, onChange }: FormSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}