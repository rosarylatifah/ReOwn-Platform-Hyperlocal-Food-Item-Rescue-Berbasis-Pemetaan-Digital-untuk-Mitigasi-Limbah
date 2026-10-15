export default function StatusChip({ tone, children }) {
  return <span className={"adm-chip adm-chip--" + tone}>{children}</span>;
}