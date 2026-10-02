// Enderecos e credenciais dos testes, num lugar so (config, API e testes).

// Abaixo de 32768: dali para cima o Linux sorteia a porta de saida das
// conexoes, e no CI um download em andamento ja ocupou a 34600 (02/10/2026).
export const API_PORTA = Number(process.env.E2E_API_PORTA || 18600);
export const FRONT_PORTA = Number(process.env.E2E_FRONT_PORTA || 18601);
export const API_URL = `http://127.0.0.1:${API_PORTA}`;
export const FRONT_URL = `http://127.0.0.1:${FRONT_PORTA}`;

// O banco e APAGADO a cada execucao: o nome precisa terminar em _e2e.
export const DATABASE_URL = process.env.E2E_DATABASE_URL || "mysql://root:teste@127.0.0.1:3306/game_jam_e2e";

// Organizador semeado por back-end/scripts/banco-e2e.js.
export const ORGANIZADOR = { usuario: "organizacao.e2e", senha: "senha-da-organizacao-e2e" };
