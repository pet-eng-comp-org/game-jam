import axios from "axios";

// Chamadas do painel: vao para o proprio site, que acrescenta o token
// (app/api/painel). Sessao vencida volta para o login.
export const painel = axios.create({ baseURL: "/api/painel" });

painel.interceptors.response.use(undefined, (err) => {
  if (axios.isAxiosError(err) && err.response?.status === 401) window.location.assign("/login");
  return Promise.reject(err);
});
