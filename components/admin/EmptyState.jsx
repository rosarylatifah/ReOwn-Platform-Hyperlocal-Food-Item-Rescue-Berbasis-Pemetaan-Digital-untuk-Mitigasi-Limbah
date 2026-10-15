export default function EmptyState({ title, hint, children }) {
  return (
    <div className="adm-empty">
      <b>{title}</b>
      {hint && <p>{hint}</p>}
      {children}
    </div>
  );
}