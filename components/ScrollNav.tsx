import Image from "next/image";
import RollingNumber from "./RollingNumber";

export default function ScrollNav({
  current,
  total,
  onUp,
  onDown,
  className = "fixed bottom-[4.67923vw] right-[3.48958vw] z-30",
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
      <div className="flex w-[2.08333vw] flex-col items-center font-normal">
        <RollingNumber value={current} />
        <div className="flex h-[2.5vw] w-full items-center justify-center">
          <span className="h-[1.45833vw] w-px bg-white/40" />
        </div>
        <RollingNumber value={total} />
      </div>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={onUp}
          disabled={disabled}
          aria-label="Previous"
          className="group flex size-[2.5vw] items-center justify-center border border-[#f3f3f3] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          <span className="relative block h-[0.67708vw] w-[1.25vw] overflow-hidden">
            <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
              <Image src="/assets/icons/chevron-up.svg" alt="" width={26} height={14} className="h-[0.67708vw] w-[1.25vw]" />
              <Image src="/assets/icons/chevron-up.svg" alt="" width={26} height={14} className="h-[0.67708vw] w-[1.25vw]" />
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={onDown}
          disabled={disabled}
          aria-label="Next"
          className="group flex size-[2.5vw] items-center justify-center border border-[#f3f3f3] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          <span className="relative block h-[0.67708vw] w-[1.25vw] overflow-hidden">
            <span className="flex flex-col -translate-y-1/2 transition-transform duration-300 ease-out group-hover:translate-y-0">
              <Image src="/assets/icons/chevron-down.svg" alt="" width={26} height={14} className="h-[0.67708vw] w-[1.25vw]" />
              <Image src="/assets/icons/chevron-down.svg" alt="" width={26} height={14} className="h-[0.67708vw] w-[1.25vw]" />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
