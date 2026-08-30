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
      className="relative flex size-[8.97436vw] items-center justify-center md:size-[2.5vw]"
    >
      <span
        className={`relative block h-[2.25385vw] transition-[width] duration-300 ease-out md:h-[0.625vw] md:w-[1.82292vw] ${
          open ? "w-[8.46154vw]" : "w-[6.54385vw]"
        }`}
      >
        {/* Centering via top/bottom-1/2 + translate-1/2 (percentages of the
            bar's own box) lands both bars dead-center regardless of the
            container's vw baseline — no eyeballed offset to keep in sync
            between breakpoints. The bars also grow to the full button width
            on open (mobile only — desktop's hamburger and X are already the
            same width) so the X matches the close-x asset's proportions
            instead of staying cramped at the narrower hamburger width. */}
        <span
          className={`absolute left-0 h-[2px] w-full origin-center bg-[#f3f3f3] transition-all duration-300 ease-out ${
            open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0 translate-y-0 rotate-0"
          }`}
        />
        <span
          className={`absolute left-0 h-[2px] w-full origin-center bg-[#f3f3f3] transition-all duration-300 ease-out ${
            open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0 translate-y-0 rotate-0"
          }`}
        />
      </span>
    </button>
  );
}
