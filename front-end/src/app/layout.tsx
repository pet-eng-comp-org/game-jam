import type { Metadata } from "next";
import { Inter, Jomhuria } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Inter e a fonte de corpo do mockup da Season 4, nos pesos 400/500/700.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
