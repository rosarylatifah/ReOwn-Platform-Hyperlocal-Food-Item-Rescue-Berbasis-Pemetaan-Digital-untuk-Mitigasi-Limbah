interface SectionHeadingProps {
  title: string;
  desc?: string;
  className?: string;
}

export default function SectionHeading({ title, desc, className = "" }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <h2 className="font-display text-3xl font-extrabold uppercase leading-tight text-stone-900 sm:text-5xl">
        {title}
      </h2>
      {desc && <p className="mt-4 text-stone-600">{desc}</p>}
    </div>
  );
}
