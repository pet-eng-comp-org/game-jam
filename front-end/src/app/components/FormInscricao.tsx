"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { api } from "@/services/api";
import { montaInscricao, type ErrosFormulario } from "@/lib/inscricao";
import InscricaoRecebida from "./InscricaoRecebida";

interface FormInscricaoProps {
  numParticipantesPorEquipe: number;
  // Para a tela de inscricao recebida: numero, dia e local do evento.
  season?: { numero: string; dataEvento: string | null; local: string | null };
}

// Tres etapas, como a inscricao nova do IntroComp e o checkout de evento
// (Sympla, Eventbrite): a equipe, as pessoas e a revisao antes de enviar. A
// revisao existe porque o erro mais comum numa inscricao em grupo e o e-mail
// de um colega digitado errado, e so ali a pessoa ve tudo junto.
const ETAPAS = ["Equipe", "Participantes", "Revisar"] as const;

export default function FormInscricao({ numParticipantesPorEquipe, season }: FormInscricaoProps) {
  const [formDataState, setFormDataState] = useState<{ [key: string]: string | boolean }>({});
  const [ufesStatus, setUfesStatus] = useState<{ [key: number]: boolean | undefined }>({});
  // O tamanho da equipe e escolhido na primeira etapa, em vez de ir
  // acrescentando participantes: quem vem sozinho ve so um bloco de campos, e
  // ninguem fica com um participante em branco no meio do formulario.
  const [quantos, setQuantos] = useState(1);
  const [etapa, setEtapa] = useState(0);
  const [erros, setErros] = useState<ErrosFormulario>({});

  // Trava o botão enquanto a inscrição vai: um toque duplo no celular criava
  // a equipe duas vezes.
  const [enviando, setEnviando] = useState(false);

  // Erro do envio que não é de um campo (inscrições fechadas, sem conexão,
  // limite de tentativas). Fica parado ao lado do botão: antes era um aviso
  // que sumia em segundos, e quem não viu não sabia por que nada aconteceu.
  const [falha, setFalha] = useState<string | null>(null);

  // Nome da equipe que acabou de se inscrever: troca o formulario pela tela
  // de inscricao recebida.
  const [recebida, setRecebida] = useState<string | null>(null);

  // Ao trocar de etapa, o titulo dela recebe o foco (o leitor de tela anuncia a
  // etapa nova) e a pagina volta para o topo do formulario.
  const tituloRef = useRef<HTMLHeadingElement>(null);
  // Compara com a etapa anterior, e nao com "primeira vez": em
  // desenvolvimento o React roda o efeito duas vezes, e a pagina abria rolada.
  const etapaAnteriorRef = useRef(etapa);
  useEffect(() => {
    if (etapaAnteriorRef.current === etapa) return;
    etapaAnteriorRef.current = etapa;
    tituloRef.current?.focus({ preventScroll: true });
    tituloRef.current?.closest("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [etapa]);

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormDataState(prev => ({ ...prev, [name]: value }));
    // Quem corrige o campo não precisa continuar vendo o erro dele.
    if (erros[name]) setErros(prev => semCampos(prev, k => k === name));
  };

  const mostraErros = (novos: ErrosFormulario) => {
    setErros(novos);
    // Depois de desenhar, leva a pessoa ao primeiro campo com problema, na
    // ordem da tela.
    requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid=true], [data-invalido=true]")?.focus());
  };

  // Os erros de uma etapa. O montaInscricao confere tudo de uma vez; aqui
  // ficam so os da etapa atual. Participante escolhido no tamanho da equipe e
  // deixado em branco e erro (o montaInscricao o pularia em silencio).
  const errosDaEtapa = (n: number): ErrosFormulario => {
    const r = montaInscricao(formDataState, ufesStatus, quantos);
    const todos: ErrosFormulario = r.ok ? {} : { ...r.erros };
    for (let i = 2; i <= quantos; i++) {
      if (!valor("nome" + i).trim() && !todos["nome" + i]) todos["nome" + i] = "Informe o nome.";
      if (!valor("email" + i).trim() && !todos["email" + i]) todos["email" + i] = "Informe o e-mail.";
      if (ufesStatus[i] === undefined && !todos["ufes" + i]) todos["ufes" + i] = "Informe se estuda na Ufes.";
    }
    if (n === 0) return todos.equipe ? { equipe: todos.equipe } : {};
    if (n === 1) return semCampos(todos, k => k === "equipe");
    return todos;
  };

  const avanca = () => {
    const e = errosDaEtapa(etapa);
    if (Object.keys(e).length > 0) {
      mostraErros(e);
      return;
    }
    setErros({});
    setEtapa(etapa + 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Enter num campo das primeiras etapas avanca, em vez de enviar.
    if (etapa < ETAPAS.length - 1) return avanca();
    if (enviando) return;

    const inscricao = montaInscricao(formDataState, ufesStatus, quantos);
    if (!inscricao.ok) {
      setEtapa(inscricao.erros.equipe ? 0 : 1);
      mostraErros(inscricao.erros);
      return;
    }

    setEnviando(true);
    setFalha(null);
    try {
      // Uma requisição só: a API grava a equipe e os participantes juntos, ou nada.
      await api.post("/inscricao", { equipe: inscricao.equipe, participantes: inscricao.participantes });

      setRecebida(inscricao.equipe);
      setFormDataState({});
      setUfesStatus({});
      setQuantos(1);
      setEtapa(0);
      setErros({});
    } catch (err) {
      // A API explica o motivo (inscrições fechadas, equipe grande demais, e-mail
      // já inscrito, limite de tentativas) e, quando é de um campo, qual. Nada
      // foi gravado, então dá para voltar à etapa do campo, corrigir e enviar.
      const dados = isAxiosError(err) ? err.response?.data : undefined;
      const motivo: string | undefined = dados?.error ?? dados?.message;
      if (dados?.campo && motivo) {
        setEtapa(dados.campo === "equipe" ? 0 : 1);
        mostraErros({ [dados.campo]: motivo.replace(/^Participante \d+: /, "") });
        return;
      }
      setFalha(
        motivo ??
          (isAxiosError(err) && !err.response
            ? "Sem conexão com o site. Confira a internet e envie de novo."
            : "Não foi possível enviar a inscrição. Envie de novo em alguns minutos."),
      );
    } finally {
      setEnviando(false);
    }
  };

  const valor = (campo: string) => (formDataState[campo] as string) || "";

  // Validacao ao sair do campo, e nao a cada tecla: avisar "e-mail invalido"
  // enquanto a pessoa ainda digita o @ so atrapalha. Campo vazio fica para o
  // Continuar, para quem so passou por ele com o Tab nao levar bronca.
  const confereCampo = (campo: string) => {
    if (!valor(campo).trim()) return;
    const e = errosDaEtapa(etapa)[campo];
    setErros(prev => (e ? { ...prev, [campo]: e } : semCampos(prev, k => k === campo)));
  };

  // Liga o campo à mensagem de erro dele, para o leitor de tela ler junto.
  const marca = (campo: string) => ({
    id: campo,
    "aria-invalid": erros[campo] ? true : undefined,
    "aria-describedby": erros[campo] ? `${campo}-erro` : undefined,
    onBlur: () => confereCampo(campo),
    className: `${CAMPO} ${erros[campo] ? "border-[#FF8A7A] ring-2 ring-[#FF8A7A]/40" : ""}`,
  });

  // E-mail com cara de certo ganha o visto verde, como nos cadastros grandes.
  const emailOk = (campo: string) => !erros[campo] && EMAIL.test(valor(campo).trim());

  const mudaQuantos = (n: number) => {
    // Quem diminui a equipe perde o que digitou nos participantes que sairam:
    // se voltar a aumentar, eles voltam em branco.
    const sai = (campo: string) => Number(campo.replace(/^[a-z]+/, "")) > n;
    setFormDataState(prev => semCampos(prev, sai));
    setErros(prev => semCampos(prev, sai));
    setUfesStatus(prev => Object.fromEntries(Object.entries(prev).filter(([i]) => Number(i) <= n)));
    setQuantos(n);
  };

  if (recebida) return <InscricaoRecebida equipe={recebida} season={season} outra={() => setRecebida(null)} />;

  const indices = Array.from({ length: quantos }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit} noValidate className="scroll-mt-28">
      <Progresso atual={etapa} />

      <div className="mt-8 rounded-2xl border border-white/10 bg-barra p-6 sm:p-8">
        <h2 ref={tituloRef} tabIndex={-1} className="font-secao text-5xl uppercase leading-none text-destaque outline-none">
          {etapa === 0 ? "Sua equipe" : etapa === 1 ? (quantos === 1 ? "Sobre você" : "Quem participa") : "Confira e envie"}
        </h2>

        {etapa === 0 && (
          <div className="mt-6 flex flex-col gap-7">
            <Campo id="equipe" rotulo="Nome da equipe" erro={erros.equipe}>
              <input {...marca("equipe")} type="text" value={valor("equipe")} maxLength={80}
                onChange={e => handleInputChange("equipe", e.target.value)} />
            </Campo>

            <Opcoes legenda="Quantas pessoas na equipe?" nome="quantos"
              opcoes={Array.from({ length: numParticipantesPorEquipe }, (_, i) => ({ valor: String(i + 1), rotulo: i === 0 ? "Só eu" : `${i + 1} pessoas` }))}
              escolhida={String(quantos)} muda={v => mudaQuantos(Number(v))} />

            <p className="text-[15px] leading-relaxed text-white/70">
              Quem tem menos de 18 anos se inscreve com o conhecimento de um responsável (veja as{" "}
              <Link href="/regras" className="text-destaque underline underline-offset-2">regras</Link>).
            </p>
          </div>
        )}

        {etapa === 1 && (
          <div className="mt-6 flex flex-col gap-6">
            {indices.map(i => (
              <fieldset key={i} className={`min-w-0 ${quantos > 1 ? "rounded-xl border border-white/10 bg-fundo/40 p-5 sm:p-6" : ""}`}>
                {quantos > 1 && (
                  <legend className="float-left mb-5 w-full text-lg font-bold text-white">Participante {i}</legend>
                )}
                <div className="clear-both grid gap-x-5 gap-y-5 sm:grid-cols-2">
                  <Campo id={`nome${i}`} rotulo="Nome" leitor={`Nome do participante ${i}`} erro={erros["nome" + i]}>
                    <input {...marca("nome" + i)} type="text" autoComplete={i === 1 ? "name" : "off"}
                      value={valor("nome" + i)} onChange={e => handleInputChange("nome" + i, e.target.value)} />
                  </Campo>

                  <Campo id={`email${i}`} rotulo="E-mail" leitor={`E-mail do participante ${i}`} erro={erros["email" + i]}>
                    <div className="relative">
                      <input {...marca("email" + i)} type="email" inputMode="email" autoComplete={i === 1 ? "email" : "off"}
                        value={valor("email" + i)} onChange={e => handleInputChange("email" + i, e.target.value)} />
                      {emailOk("email" + i) && (
                        <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5BE37D]">
                          <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </Campo>

                  <div className="sm:col-span-2">
                    {/* Comeca sem resposta: pre-marcado "Sim", quem era de fora e nao
                        reparava ficava registrado como aluno da Ufes. */}
                    <Opcoes legenda="Estuda na Ufes?" leitor={`O participante ${i} estuda na Ufes?`} nome={`ufes${i}`} erro={erros["ufes" + i]}
                      opcoes={[{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }]}
                      escolhida={ufesStatus[i] === undefined ? undefined : ufesStatus[i] ? "sim" : "nao"}
                      muda={v => {
                        setUfesStatus(prev => ({ ...prev, [i]: v === "sim" }));
                        if (erros["ufes" + i]) setErros(prev => semCampos(prev, k => k === "ufes" + i));
                      }} />
                  </div>

                  {ufesStatus[i] === false && (
                    <div className="sm:col-span-2">
                      <Campo id={`instituicao${i}`} rotulo="Instituição de ensino" leitor={`Instituição de ensino do participante ${i}`} dica="A escola ou a faculdade." erro={erros["instituicao" + i]}>
                        <input {...marca("instituicao" + i)} type="text"
                          value={valor("instituicao" + i)} onChange={e => handleInputChange("instituicao" + i, e.target.value)} />
                      </Campo>
                    </div>
                  )}

                  <Campo id={`curso${i}`} rotulo="Curso" leitor={`Curso do participante ${i}, opcional`} opcional>
                    <input {...marca("curso" + i)} type="text"
                      value={valor("curso" + i)} onChange={e => handleInputChange("curso" + i, e.target.value)} />
                  </Campo>

                  <Campo id={`genero${i}`} rotulo="Gênero" leitor={`Gênero do participante ${i}, opcional`} opcional>
                    <div className="relative">
                      <select id={`genero${i}`} value={valor("genero" + i) || "nao-informado"}
                      onChange={e => handleInputChange("genero" + i, e.target.value)} className={`${CAMPO} appearance-none pr-10`}>
                      <option value="nao-informado">Prefiro não informar</option>
                      <option value="feminino">Feminino</option>
                      <option value="masculino">Masculino</option>
                      <option value="outros">Outro</option>
                    </select>
                      <svg aria-hidden viewBox="0 0 10 6" className="pointer-events-none absolute right-4 top-1/2 h-1.5 w-2.5 -translate-y-1/2 text-destaque-claro"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
                    </div>
                  </Campo>
                </div>
              </fieldset>
            ))}
          </div>
        )}

        {etapa === 2 && (
          <div className="mt-6 flex flex-col gap-5 text-white/85">
            <Resumo titulo="Equipe" editar={() => setEtapa(0)}>
              <p className="text-lg font-bold text-white">{valor("equipe").trim()}</p>
              <p className="text-white/60">{quantos === 1 ? "1 pessoa" : `${quantos} pessoas`}</p>
            </Resumo>
            <Resumo titulo={quantos === 1 ? "Você" : "Participantes"} editar={() => setEtapa(1)}>
              <ul className="flex flex-col gap-4">
                {indices.map(i => (
                  <li key={i}>
                    <p className="font-bold text-white">{valor("nome" + i).trim()}</p>
                    <p className="break-all">{valor("email" + i).trim()}</p>
                    <p className="text-white/60">
                      {ufesStatus[i] ? "Estuda na Ufes" : valor("instituicao" + i).trim()}
                      {valor("curso" + i).trim() && ` · ${valor("curso" + i).trim()}`}
                    </p>
                  </li>
                ))}
              </ul>
            </Resumo>

            {/* Aviso em camadas: a LGPD (art. 9) pede a finalidade na hora da coleta; o
                resto (quem acessa, por quanto tempo, como apagar) fica na pagina. */}
            <p className="text-sm text-white/60">
              Usamos estes dados só para organizar o evento e falar com a equipe.{" "}
              <Link href="/privacidade" className="text-destaque-claro underline underline-offset-2">Privacidade</Link>
            </p>
          </div>
        )}

        {etapa === ETAPAS.length - 1 && falha && (
          <p role="alert" className={`mt-6 rounded-lg border border-[#FF8A7A]/50 bg-[#FF8A7A]/10 px-4 py-3 ${ERRO}`}>{falha}</p>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {etapa > 0 ? (
            <button type="button" onClick={() => { setErros({}); setEtapa(etapa - 1); }}
              className="h-12 rounded-full px-6 font-bold text-destaque-claro transition-colors hover:bg-white/5">
              Voltar
            </button>
          ) : <span />}
          <button type="submit" disabled={enviando}
            className="h-12 rounded-full bg-[#FFCF00] px-8 text-lg font-bold text-[#001059] transition-opacity hover:opacity-90 disabled:opacity-60 sm:min-w-[200px]">
            {etapa < ETAPAS.length - 1 ? "Continuar" : enviando ? "Enviando..." : "Enviar inscrição"}
          </button>
        </div>
      </div>
    </form>
  );
}

// Barra das etapas, como a do IntroComp: um traco por etapa, aceso ate a atual.
function Progresso({ atual }: { atual: number }) {
  return (
    <ol className="grid grid-cols-3 gap-3" aria-label="Etapas da inscrição">
      {ETAPAS.map((nome, i) => (
        <li key={nome} aria-current={i === atual ? "step" : undefined}
          className={`border-t-4 pt-2 text-sm ${i <= atual ? "border-destaque" : "border-white/15"}`}>
          <span className={`font-bold ${i <= atual ? "text-destaque" : "text-white/40"}`}>{i + 1}</span>{" "}
          <span className={i === atual ? "font-bold text-white" : "text-white/60"}>{nome}</span>
        </li>
      ))}
    </ol>
  );
}

function Resumo({ titulo, editar, children }: { titulo: string; editar: () => void; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-fundo/40 p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white/50">{titulo}</h3>
        <button type="button" onClick={editar} className="text-sm font-bold text-destaque-claro underline underline-offset-2">
          Editar<span className="sr-only"> {titulo.toLowerCase()}</span>
        </button>
      </div>
      {children}
    </section>
  );
}

// Escolha entre poucas opcoes em botoes lado a lado (radio por baixo), como o
// turno na inscricao do IntroComp: um toque, sem abrir uma lista.
function Opcoes({ legenda, leitor, nome, opcoes, escolhida, muda, erro }: {
  legenda: string; leitor?: string; nome: string; opcoes: { valor: string; rotulo: string }[];
  escolhida?: string; muda: (v: string) => void; erro?: string;
}) {
  return (
    <fieldset className="min-w-0" aria-describedby={erro ? `${nome}-erro` : undefined}>
      <legend className={ROTULO}>
        <span aria-hidden={leitor ? true : undefined}>{legenda}</span>
        {leitor && <span className="sr-only">{leitor}</span>}
      </legend>
      <div className="mt-2.5 flex gap-2 sm:gap-2.5">
        {opcoes.map((o, k) => (
          <label key={o.valor} className="relative min-w-0 flex-1">
            <input type="radio" name={nome} value={o.valor} checked={escolhida === o.valor}
              onChange={() => muda(o.valor)} className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
              id={k === 0 ? nome : undefined} data-invalido={erro ? true : undefined} />
            <span className={`flex h-12 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border px-2 text-[15px] font-bold sm:text-base transition-colors peer-checked:border-destaque peer-checked:bg-destaque peer-checked:text-[#001059] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-destaque ${erro ? "border-[#FF8A7A] text-white" : "border-white/20 text-white hover:border-white/40"}`}>
              {o.rotulo}
            </span>
          </label>
        ))}
      </div>
      {erro && <p id={`${nome}-erro`} className={`mt-2 ${ERRO}`}>{erro}</p>}
    </fieldset>
  );
}

function semCampos<T>(objeto: { [campo: string]: T }, tira: (campo: string) => boolean) {
  return Object.fromEntries(Object.entries(objeto).filter(([k]) => !tira(k)));
}

// Campo escuro com borda, que aparece sobre o cartao. Os campos creme sem borda
// do mockup pareciam faixas de cor, nao lugares para escrever.
const CAMPO = "h-12 w-full rounded-lg border border-white/20 bg-fundo px-4 text-base text-white outline-none transition-colors placeholder:text-white/40 hover:border-white/35 focus:border-destaque focus:ring-2 focus:ring-destaque/30";

const ROTULO = "text-[15px] font-bold text-white";

// O mesmo teste do montaInscricao (lib/inscricao.ts).
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Campo({ id, rotulo, leitor, dica, opcional, erro, children }: {
  id: string; rotulo: string; leitor?: string; dica?: string; opcional?: boolean; erro?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className={ROTULO}>
        <span aria-hidden={leitor ? true : undefined}>{rotulo}</span>
        {opcional && <span aria-hidden={leitor ? true : undefined} className="font-normal text-white/50"> (opcional)</span>}
        {leitor && <span className="sr-only">{leitor}</span>}
      </label>
      {children}
      {dica && !erro && <p className="text-sm text-white/55">{dica}</p>}
      {erro && <p id={`${id}-erro`} className={ERRO}>{erro}</p>}
    </div>
  );
}

// Erro ao lado do campo: rosa claro, legível sobre o azul do fundo.
const ERRO = "text-sm leading-snug text-[#FFB4A8]";
