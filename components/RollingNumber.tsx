function RollingDigit({ digit }: { digit: number }) {
  return (
    <span className="relative inline-block h-[1.25vw] w-[0.625vw] overflow-hidden align-top">
      <span
        className="absolute left-0 top-0 flex flex-col text-[0.88542vw] transition-transform duration-500 ease-out"
        style={{ transform: `translateY(-${digit * 10}%)` }}
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span key={n} className="flex h-[1.25vw] items-center justify-center leading-none">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function RollingNumber({ value }: { value: number }) {
  const padded = Math.max(0, value).toString().padStart(2, "0");
  return (
    <span className="inline-flex">
      {padded.split("").map((d, i) => (
        <RollingDigit key={i} digit={Number(d)} />
      ))}
    </span>
  );
}
