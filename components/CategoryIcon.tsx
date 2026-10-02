import { IconBadge, IconBed, IconCurtain, IconDrop, IconHanger, IconIron, IconShirt } from "./Icons";

const MAP: Record<string, (p: { className?: string }) => React.ReactElement> = {
  "wash-press": IconDrop,
  "press-only": IconIron,
  "dry-clean": IconHanger,
  curtains: IconCurtain,
  bedding: IconBed,
  uniforms: IconBadge,
};

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = MAP[slug] ?? IconShirt;
  return <Icon className={className} />;
}
