import { cn } from "@/lib/utils";

const PALETTES = [
  { bg: "#DBEAFE", text: "#1D4ED8" },
  { bg: "#D1FAE5", text: "#065F46" },
  { bg: "#FEF3C7", text: "#92400E" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#FFEDD5", text: "#7C2D12" },
  { bg: "#E0F2FE", text: "#075985" },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const SIZES: Record<string, string> = {
  "2xs": "w-5 h-5 text-[8px]",
  xs:    "w-6 h-6 text-[9px]",
  sm:    "w-8 h-8 text-[11px]",
  md:    "w-9 h-9 text-xs",
  lg:    "w-10 h-10 text-sm",
  xl:    "w-12 h-12 text-base",
};

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
  ring?: boolean;
}

export default function Avatar({ name, src, size = "md", className, ring }: AvatarProps) {
  const pal = PALETTES[name.charCodeAt(0) % PALETTES.length];

  if (src) {
    return <img src={src} alt={name} title={name} className={cn("rounded-full object-cover shrink-0", SIZES[size], ring && "ring-2 ring-white", className)} />;
  }

  return (
    <div
      className={cn("rounded-full flex items-center justify-center font-bold shrink-0 select-none", SIZES[size], ring && "ring-2 ring-white", className)}
      style={{ background: pal.bg, color: pal.text }}
      aria-label={name}
      title={name}
    >
      {initials(name)}
    </div>
  );
}

export function AvatarGroup({ names, max = 3, size = "xs" }: { names: string[]; max?: number; size?: keyof typeof SIZES }) {
  const shown = names.slice(0, max);
  const extra = names.length - max;
  return (
    <div className="flex -space-x-1.5">
      {shown.map((n) => <Avatar key={n} name={n} size={size} ring />)}
      {extra > 0 && (
        <div className={cn("rounded-full flex items-center justify-center font-bold ring-2 ring-white shrink-0 text-[9px] bg-slate-100 text-slate-500", SIZES[size])}>
          +{extra}
        </div>
      )}
    </div>
  );
}
