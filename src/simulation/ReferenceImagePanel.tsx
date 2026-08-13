export default function ReferenceImagePanel({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`reference-panel ${open ? "" : "collapsed"}`}>
      <header>
        <span>Reference Image</span>
        <button onClick={onToggle}>{open ? "Hide" : "Show"}</button>
      </header>
      <img
        src="/reference/secret-knock-lock-reference.png"
        alt="Secret Knock Door Lock — design reference"
      />
    </div>
  );
}
