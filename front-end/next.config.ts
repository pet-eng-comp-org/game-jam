import type { NextConfig } from "next";

// O "standalone" faz o Next emitir um servidor minimo em .next/standalone, com
// so as dependencias que o codigo importa. E o que o Dockerfile copia, e sem
// ele a imagem teria que carregar o node_modules inteiro.
//
// Mas ele NAO pode valer na Vercel. La o build quebra no passo final com:
//
//   ENOENT: no such file or directory, open '.next/next-server.js.nft.json'
//
// porque o standalone move o rastreamento de arquivos para dentro de
// .next/standalone/, e a Vercel procura em .next/. As 16 paginas geram
// normalmente e a falha so aparece no fim, no onBuildComplete — o que faz o
// erro parecer nao ter relacao nenhuma com esta linha.
//
// A variavel VERCEL e definida por ela em todo build. Enquanto o site estiver
// nos dois lugares, isto mantem os dois funcionando. Quando sair da Vercel,
// vira so `output: "standalone"`.
const nextConfig: NextConfig = {
  // Os testes de ponta a ponta compilam em outra pasta (e2e/sobe-front.sh), para
  // nao sobrescrever o .next de quem roda o site na maquina.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
};

export default nextConfig;
