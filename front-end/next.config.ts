import type { NextConfig } from "next";

// O "standalone" faz o Next emitir um servidor minimo em .next/standalone, com
// so as dependencias que o codigo importa. E o que o Dockerfile copia, e sem
// ele a imagem teria que carregar o node_modules inteiro.
// Os mesmos cabecalhos que a API ja manda pelo helmet. Sem eles, o painel (que
// mostra o CPF dos inscritos) podia ser carregado dentro de uma pagina de
// terceiros, e o navegador aceitava o site por http na primeira visita.
const cabecalhosDeSeguranca = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: cabecalhosDeSeguranca }];
  },
  // Os testes de ponta a ponta compilam em outra pasta (e2e/sobe-front.sh), para
  // nao sobrescrever o .next de quem roda o site na maquina.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
