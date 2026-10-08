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
  // A pagina era /apoio, mas o menu sempre disse "Patrocinadores". Link antigo
  // (divulgacao, buscador) continua chegando.
  async redirects() {
    return [{ source: "/apoio", destination: "/patrocinadores", permanent: true }];
  },
  // Os testes de ponta a ponta compilam em outra pasta (e2e/sobe-front.sh), para
  // nao sobrescrever o .next de quem roda o site na maquina.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Otimizador de imagens (next/image) so para as capas dos jogos antigos, que
  // ficam em public/jogos: sao JPGs de 800x600 exibidos com 130 a 350 px, e
  // saem em WebP no tamanho da tela. Nada de query string nem outra pasta.
  images: {
    localPatterns: [{ pathname: "/jogos/**", search: "" }],
    qualities: [75],
  },
  // O `next dev` so atende o proprio localhost: aberto por outro endereco (o
  // celular, por uma VPN ou tunel), a pagina vem sem JavaScript. Quem precisa
  // lista os hostnames em NEXT_DEV_ORIGENS, separados por virgula. Em producao
  // nao tem efeito.
  allowedDevOrigins: process.env.NEXT_DEV_ORIGENS?.split(",").map((o) => o.trim()).filter(Boolean),
};

export default nextConfig;
