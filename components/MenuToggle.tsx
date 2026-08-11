export default function MenuToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="relative flex size-[2.5vw] items-center justify-center"
    >
      <span className="relative block h-[0.625vw] w-[1.82292vw]">
        <span
          className={`absolute left-0 top-0 h-[2px] w-full origin-center bg-[#f3f3f3] transition-transform duration-300 ease-out ${
            open ? "translate-y-[0.26042vw] rotate-45" : "translate-y-0 rotate-0"
          }`}
        />
        <span
          className={`absolute bottom-0 left-0 h-[2px] w-full origin-center bg-[#f3f3f3] transition-transform duration-300 ease-out ${
            open ? "-translate-y-[0.26042vw] -rotate-45" : "translate-y-0 rotate-0"
          }`}
        />
      </span>
    </button>
  );
}
