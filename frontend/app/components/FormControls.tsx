type FieldProps = {
  label: string;
  name?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
};

export function Field({ label, name, placeholder, type = "text", required, defaultValue }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} />
    </label>
  );
}

export function SelectField({
  label,
  name,
  required,
  defaultValue,
  children,
}: Readonly<{ label: string; name?: string; required?: boolean; defaultValue?: string; children: React.ReactNode }>) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} required={required} defaultValue={defaultValue}>{children}</select>
    </label>
  );
}

export function TextAreaField({ label, name, placeholder, required, defaultValue }: FieldProps) {
  return (
    <label className="field textarea-field">
      <span>{label}</span>
      <textarea name={name} placeholder={placeholder} rows={4} required={required} defaultValue={defaultValue} />
    </label>
  );
}

export function PillGroup({ items, name = "items" }: { items: string[]; name?: string }) {
  return (
    <div className="pill-group" role="group" aria-label="Hiring categories">
      {items.map((item) => (
        <label className="pill-option" key={item}>
          <input name={name} type="checkbox" value={item} />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}
