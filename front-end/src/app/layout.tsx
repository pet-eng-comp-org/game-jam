import type { Metadata } from "next";
import { Jomhuria } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

// Inter e a fonte de corpo do mockup da Season 4, nos pesos 400/500/700. E a
// 3.19, hospedada aqui, e nao a do Google Fonts: o mockup foi feito com ela, e
// a do Google (4.x) tem outro espacamento — a mesma linha de 18px saia 28px
// mais estreita que no Figma e quebrava em outro lugar. Medido no Chrome:
// Figma 1140px, Inter 3.19 1137px, Google 1112px. Arquivos so com o latim
// (fontTools subset) e gerados da versao DESKTOP: a "Inter Web" do mesmo
// pacote tem outras medidas (1115px na mesma linha). Licenca OFL em
// fontes/LICENCA-inter.txt.
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    { path: "./fontes/inter-3.19-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fontes/inter-3.19-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fontes/inter-3.19-Bold.woff2", weight: "700", style: "normal" },
  ],
});

// Jomhuria e a condensada dos titulos de secao do mockup (48px). Ao contrario
// do PacFont, ela TEM os acentuados, entao "DUVIDAS" e "PREMIACAO" saem certos.
const jomhuria = Jomhuria({
  variable: "--font-jomhuria",
  subsets: ["latin"],
  weight: ["400"],
});

// Carimbo de versao: qual commit gerou o que esta no ar.
//
// Existe por causa de uma falha real. O plano atual da Vercel so implanta commit
// autorado pela conta do PET; commit de outra pessoa entra no main, a Vercel
// recusa em silencio, e o site continua na versao anterior. Foi assim que ele
// serviu um build de dezembro por seis semanas, e ninguem percebeu porque nao
// havia como olhar o site e saber qual versao era aquela.
//
// Com o carimbo, qualquer pessoa confere pelo HTML, e o workflow
// confere-versao-no-ar.yml confere sozinho a cada push.
//
// A Vercel define VERCEL_GIT_COMMIT_SHA no build. Fora dela — na imagem Docker
// — o valor vem do build-arg COMMIT. Sem nenhum dos dois, fica "desconhecida",
// que ja e informacao: significa build feito fora da esteira.
const versao =
  process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.COMMIT ?? "desconhecida";

const descricao =
  "O Game Jam é uma competição de programação em equipes, em um dia, organizada pelo PET Engenharia de Computação da UFES.";

export const metadata: Metadata = {
  other: { versao },
  // Sem metadataBase o Next resolve as URLs de imagem contra localhost, e a
  // prévia do link sai quebrada fora da máquina de quem construiu.
  metadataBase: new URL("https://gamejam.pet.inf.ufes.br"),
  title: "PET Game Jam",
  description: descricao,
  // Sem isto, o link colado no WhatsApp ou no Instagram aparece sem imagem e
  // sem texto nenhum — e divulgação é metade do evento.
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "PET Game Jam",
    title: "PET Game Jam",
    description: descricao,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PET Game Jam" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PET Game Jam",
    description: descricao,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.variable} ${jomhuria.variable} font-sans antialiased`}
      >
        <Toaster 
          position="bottom-right"
        />
        {children}
      </body>
    </html>
  );
}
