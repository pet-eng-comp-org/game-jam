import type { NextConfig } from "next";

// O "standalone" faz o Next emitir um servidor minimo em .next/standalone, com
// so as dependencias que o codigo importa. E o que o Dockerfile copia, e sem
// ele a imagem teria que carregar o node_modules inteiro.
const nextConfig: NextConfig = {
  output: "standalone",
  // Os testes de ponta a ponta compilam em outra pasta (e2e/sobe-front.sh), para
  // nao sobrescrever o .next de quem roda o site na maquina.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
