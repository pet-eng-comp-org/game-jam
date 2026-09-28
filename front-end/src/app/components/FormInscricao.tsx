"use client"

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { isAxiosError } from "axios";
import { api } from "@/services/api";
import { formataCpf, montaInscricao, type ErrosFormulario } from "@/lib/inscricao";
import InscricaoRecebida from "./InscricaoRecebida";

interface FormInscricaoProps {
  numParticipantesPorEquipe: number;
  // Para a tela de inscricao recebida: numero, dia e local do evento.
  season?: { numero: string; dataEvento: string | null; local: string | null };
}

export default function FormInscricao({ numParticipantesPorEquipe, season }: FormInscricaoProps) {
  const [formDataState, setFormDataState] = useState<{ [key: string]: string | boolean }>({});
  const [ufesStatus, setUfesStatus] = useState<{ [key: number]: boolean | undefined }>({});
  // O formulário começa com um participante; os outros entram pelo botão, até o
  // limite da season. Doze campos de uma vez cansavam quem vinha sozinho.
  const [quantos, setQuantos] = useState(1);
  const [erros, setErros] = useState<ErrosFormulario>({});

  // Trava o botão enquanto a inscrição vai: um toque duplo no celular criava
  // a equipe duas vezes.
  const [enviando, setEnviando] = useState(false);

  // Nome da equipe que acabou de se inscrever: troca o formulario pela tela
  // de inscricao recebida.
  const [recebida, setRecebida] = useState<string | null>(null);

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormDataState(prev => ({ ...prev, [name]: value }));
    // Quem corrige o campo não precisa continuar vendo o erro dele.
    if (erros[name]) setErros(prev => semCampos(prev, k => k === name));
  };

  const mostraErros = (novos: ErrosFormulario) => {
    setErros(novos);
    // Depois de desenhar, leva a pessoa ao primeiro campo com problema, na
    // ordem da tela.
    requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enviando) return;

    const inscricao = montaInscricao(formDataState, ufesStatus, quantos);

    if (!inscricao.ok) {
      mostraErros(inscricao.erros);
      const n = Object.keys(inscricao.erros).length;
      toast.warning(n === 1 ? Object.values(inscricao.erros)[0] : `Confira os ${n} campos marcados.`);
      return;
    }

    setEnviando(true);
    try {
      // Uma requisição só: a API grava a equipe e os participantes juntos, ou nada.
      await api.post("/inscricao", { equipe: inscricao.equipe, participantes: inscricao.participantes });

      setRecebida(inscricao.equipe);
      setFormDataState({});
      setUfesStatus({});
      setQuantos(1);
      setErros({});
    } catch (err) {
      // A API explica o motivo (inscrições fechadas, equipe grande demais, CPF
      // já inscrito, limite de tentativas) e, quando é de um campo, qual. Nada
      // foi gravado, então dá para corrigir e enviar de novo.
      const dados = isAxiosError(err) ? err.response?.data : undefined;
      const motivo: string | undefined = dados?.error ?? dados?.message;
      if (dados?.campo && motivo) mostraErros({ [dados.campo]: motivo.replace(/^Participante \d+: /, "") });
      toast.error(motivo ?? "Não foi possível enviar a inscrição. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  };

  const valor = (campo: string) => (formDataState[campo] as string) || "";
  const naoEhUfes = (i: number) => ufesStatus[i] === false;
  // Liga o campo à mensagem de erro dele, para o leitor de tela ler junto.
  const marca = (campo: string) => ({
    id: campo,
    "aria-invalid": erros[campo] ? true : undefined,
    "aria-describedby": erros[campo] ? `${campo}-erro` : undefined,
    className: `${CAMPO} ${erros[campo] ? "ring-2 ring-[#FF8A7A]" : ""}`,
  });

  const removeUltimo = () => {
    // Apaga o que foi digitado nele: se voltar, volta em branco.
    const i = quantos;
    const doUltimo = (campo: string) => campo.replace(/^[a-z]+/, "") === String(i);
    setFormDataState(prev => semCampos(prev, doUltimo));
    setErros(prev => semCampos(prev, doUltimo));
    setUfesStatus(prev => ({ ...prev, [i]: undefined }));
    setQuantos(i - 1);
  };

  const participantesForm = [];

  for (let index = 1; index <= quantos; index++) {
    participantesForm.push(
      <fieldset key={index} className="mt-10 min-w-0">
        {/* Um titulo por participante, e rotulos simples nos campos. O mockup
            numerava cada rotulo ("participante i", "email i"), o que com um
            participante so parecia erro de digitacao. */}
        <legend className="mb-[15px] font-secao text-[40px] uppercase leading-none text-destaque">Participante {index}</legend>

        <div className="grid gap-x-8 gap-y-[23px] sm:grid-cols-2">
          <Campo id={`nome${index}`} rotulo="Nome" leitor={`Nome do participante ${index}`} erro={erros["nome" + index]}>
            <input {...marca("nome" + index)} type="text" autoComplete={index === 1 ? "name" : "off"}
              value={valor("nome" + index)} onChange={e => handleInputChange("nome" + index, e.target.value)} />
          </Campo>

          <Campo id={`email${index}`} rotulo="E-mail" leitor={`E-mail do participante ${index}`} erro={erros["email" + index]}>
            <input {...marca("email" + index)} type="email" autoComplete={index === 1 ? "email" : "off"}
              value={valor("email" + index)} onChange={e => handleInputChange("email" + index, e.target.value)} />
          </Campo>

          <Campo id={`cpf${index}`} rotulo="CPF" leitor={`CPF do participante ${index}, para o certificado`} erro={erros["cpf" + index]}>
            <input {...marca("cpf" + index)} type="text" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00"
              value={valor("cpf" + index)} onChange={e => handleInputChange("cpf" + index, formataCpf(e.target.value))} />
          </Campo>

          <Campo id={`curso${index}`} rotulo="Curso" leitor={`Curso do participante ${index}, se for universitário`}>
            <input {...marca("curso" + index)} type="text"
              value={valor("curso" + index)} onChange={e => handleInputChange("curso" + index, e.target.value)} />
          </Campo>

          <Campo id={`genero${index}`} rotulo="Gênero" leitor={`Gênero do participante ${index}`}>
            <select id={`genero${index}`} value={valor("genero" + index) || "nao-informado"}
              onChange={e => handleInputChange("genero" + index, e.target.value)} className={CAMPO}>
              <option value="nao-informado">Prefiro não informar</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="outros">Outros</option>
            </select>
          </Campo>

          <Campo id={`ufes${index}`} rotulo="Estuda na Ufes?" leitor={`O participante ${index} estuda na Ufes?`} erro={erros["ufes" + index]}>
            {/* Comeca sem resposta: pre-marcado "Sim", quem era de fora e nao
                reparava ficava registrado como aluno da Ufes. */}
            <select {...marca("ufes" + index)}
              value={ufesStatus[index] === undefined ? "" : ufesStatus[index] ? "sim" : "nao"}
              onChange={e => {
                setUfesStatus(prev => ({ ...prev, [index]: e.target.value === "sim" }))
                if (erros["ufes" + index]) setErros(prev => semCampos(prev, k => k === "ufes" + index))
              }}>
              <option value="" disabled>Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </Campo>

          {naoEhUfes(index) && (
            <Campo id={`instituicao${index}`} rotulo="Instituição" leitor={`Instituição de ensino do participante ${index}`} erro={erros["instituicao" + index]}>
              <input {...marca("instituicao" + index)} type="text"
                value={valor("instituicao" + index)} onChange={e => handleInputChange("instituicao" + index, e.target.value)} />
            </Campo>
          )}
        </div>

        {index > 1 && index === quantos && (
          <button type="button" onClick={removeUltimo}
            className="mt-5 text-sm text-destaque-claro underline underline-offset-4 hover:text-[#FFCF00]">
            Remover participante {index}
          </button>
        )}
      </fieldset>
    );
  }

  if (recebida) return <InscricaoRecebida equipe={recebida} season={season} outra={() => setRecebida(null)} />;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-[555px] flex-col">
      <Campo id="equipe" rotulo="Nome da equipe" leitor="Nome da equipe" erro={erros.equipe}>
        <input {...marca("equipe")} type="text" value={valor("equipe")}
          onChange={e => handleInputChange("equipe", e.target.value)} className={`${marca("equipe").className} sm:max-w-[261px]`} />
      </Campo>

      {participantesForm}

      {quantos < numParticipantesPorEquipe && (
        <button type="button" onClick={() => setQuantos(q => q + 1)}
          className="mt-8 h-[42px] self-start border-2 border-dashed border-[#FBDC70] px-5 text-base font-bold text-[#FBDC70] transition-colors hover:bg-[#FBDC70]/10">
          + Adicionar participante
          <span className="sr-only"> (a equipe pode ter até {numParticipantesPorEquipe})</span>
        </button>
      )}

      {/* A LGPD pede que a finalidade do dado seja dita na hora da coleta.
          Aqui ficava uma declaracao obrigatoria de que alguem da equipe iria a
          Ufes buscar a premiacao, das edicoes a distancia; com a competicao
          presencial, ela saiu. */}
      <p className="mt-10 text-sm leading-snug text-destaque-claro">
        Pedimos o CPF só para emitir o certificado de participação, feito pela
        Pró-Reitoria de Extensão (Proex) da Ufes. Ele é visto apenas pela
        organização do Game Jam, não aparece em nenhuma página do site e é apagado
        depois que os certificados são emitidos.{" "}
        <Link href="/privacidade" className="text-destaque underline">Como tratamos seus dados</Link>.
      </p>

      {/* Botao do mockup: 377x61, #FFCF00, cantos de 21px (o texto era em PacFont);
          no desenho ele fica 5px a esquerda do centro da coluna. */}
      <button
        type="submit"
        disabled={enviando}
        className="mx-auto mt-10 h-[61px] w-full max-w-[377px] rounded-[21px] bg-[#FFCF00] text-xl font-bold leading-[25px] text-[#001059] lg:-translate-x-[5px] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {enviando ? "Enviando..." : "Inscrever-se"}
      </button>
    </form>
  );
}

function semCampos<T>(objeto: { [campo: string]: T }, tira: (campo: string) => boolean) {
  return Object.fromEntries(Object.entries(objeto).filter(([k]) => !tira(k)));
}

// Campo do mockup: 42px de altura, #FCECA8, sem cantos arredondados.
const CAMPO = "h-[42px] w-full bg-[#FCECA8] px-3 text-black outline-none focus:ring-2 focus:ring-[#FFCF00]";

// Rotulo em Inter negrito, #FBDC70, com a caixa normal da frase. O mockup
// usava a PacFont (dificil de ler em 16px); depois veio caixa alta espacada,
// que e o jeito generico de rotulo e grita em todo campo. O leitor de tela ouve o texto
// completo, com o numero do participante.
function Campo({ id, rotulo, leitor, erro, children }: { id: string; rotulo: string; leitor: string; erro?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-[13px]">
      <label htmlFor={id} className="leading-[20px]">
        <span aria-hidden className="text-base font-bold leading-[20px] text-[#FBDC70]">{rotulo}</span>
        <span className="sr-only">{leitor}</span>
      </label>
      {children}
      {erro && <p id={`${id}-erro`} className={`-mt-[7px] ${ERRO}`}>{erro}</p>}
    </div>
  );
}

// Erro ao lado do campo: rosa claro, legível sobre o azul do fundo.
const ERRO = "text-sm leading-snug text-[#FFB4A8]";
