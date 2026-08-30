import Image from "next/image";
import RollingNumber from "./RollingNumber";

export default function ScrollNav({
  current,
  total,
  onUp,
  onDown,
  className = "fixed bottom-[9.74359vw] right-[7.64957vw] z-30 md:bottom-[4.67923vw] md:right-[3.48958vw]",
  disabled = false,
}: {
  current: number;
  total: number;
  onUp?: () => void;
  onDown?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-[1px] text-white ${className}`}
      style={{ opacity: disabled ? 0.3 : 1 }}
    >
      <div className="flex w-[7.47872vw] flex-col items-center font-normal md:w-[2.08333vw]">
        <RollingNumber value={current} />
        <div className="flex h-[8.97436vw] w-full items-center justify-center md:h-[2.5vw]">
          <span className="h-[7.47872vw] w-px bg-white/40 md:h-[1.45833vw]" />
        </div>
        <RollingNumber value={total} />
      </div>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={onUp}
          disabled={disabled}
          aria-label="Previous"
          className="group flex size-[8.97436vw] items-center justify-center border border-[#f3f3f3] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 md:size-[2.5vw]"
        >
          <span className="relative block h-[2.43056vw] w-[4.48718vw] overflow-hidden md:h-[0.67708vw] md:w-[1.25vw]">
            <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
              <Image src="/assets/icons/chevron-up.svg" alt="" width={26} height={14} className="h-[2.43056vw] w-[4.48718vw] md:h-[0.67708vw] md:w-[1.25vw]" />
              <Image src="/assets/icons/chevron-up.svg" alt="" width={26} height={14} className="h-[2.43056vw] w-[4.48718vw] md:h-[0.67708vw] md:w-[1.25vw]" />
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={onDown}
          disabled={disabled}
          aria-label="Next"
          className="group flex size-[8.97436vw] items-center justify-center border border-[#f3f3f3] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 md:size-[2.5vw]"
        >
          <span className="relative block h-[2.43056vw] w-[4.48718vw] overflow-hidden md:h-[0.67708vw] md:w-[1.25vw]">
            <span className="flex flex-col -translate-y-1/2 transition-transform duration-300 ease-out group-hover:translate-y-0">
              <Image src="/assets/icons/chevron-down.svg" alt="" width={26} height={14} className="h-[2.43056vw] w-[4.48718vw] md:h-[0.67708vw] md:w-[1.25vw]" />
              <Image src="/assets/icons/chevron-down.svg" alt="" width={26} height={14} className="h-[2.43056vw] w-[4.48718vw] md:h-[0.67708vw] md:w-[1.25vw]" />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
