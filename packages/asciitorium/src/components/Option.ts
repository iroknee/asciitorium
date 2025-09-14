// A lightweight data-only node used as a child of <Select>.
// NOTE: Not a Component on purpose so it won't be auto-added/drawn by parent Component.
export interface OptionProps {
  value: string;
  disabled?: boolean;
  shortcutKey?: string; // e.g., "A"
  leftAdornment?: string; // e.g., "• "
  rightAdornment?: string; // e.g., " →"
  label?: string; // if omitted, uses children or value
  children?: string; // convenient JSX label text
}

export class Option {
  constructor(public props: OptionProps) {}
}
