type DetailItem = {
  label: string;
  value: string | number;
};

export function DetailDialog({
  title,
  subtitle,
  items,
  onClose,
}: Readonly<{
  title: string;
  subtitle?: string;
  items: DetailItem[];
  onClose: () => void;
}>) {
  return (
    <div className="modal-backdrop detail-backdrop" role="presentation">
      <section className="modal-card detail-card" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <header>
          <div>
            <h2 id="detail-title">{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button className="ghost-button" onClick={onClose} type="button" aria-label="Close details">
            x
          </button>
        </header>
        <dl className="detail-list">
          {items.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
