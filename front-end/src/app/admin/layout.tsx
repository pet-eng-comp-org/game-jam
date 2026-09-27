import type { Metadata } from "next";

// O painel nao aparece em busca.
export const metadata: Metadata = { title: "Painel", robots: { index: false, follow: false } };

export default function LayoutPainel({ children }: { children: React.ReactNode }) {
  return children;
}
