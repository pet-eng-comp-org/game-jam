"use client"

import { toast } from "sonner";
import { useState } from "react";
import { isAxiosError } from "axios";
import { api } from "@/services/api";
import { montaInscricao } from "@/lib/inscricao";

interface FormInscricaoProps {
  numParticipantesPorEquipe: number;
}

export default function FormInscricao({ numParticipantesPorEquipe }: FormInscricaoProps) {
  const [formDataState, setFormDataState] = useState<{ [key: string]: string | boolean }>({});
  const [ufesStatus, setUfesStatus] = useState<{ [key: number]: boolean }>(
    Object.fromEntries(Array.from({ length: numParticipantesPorEquipe }, (_, i) => [i + 1, true]))
  );

  // Trava o botão enquanto a inscrição vai: um toque duplo no celular criava
  // a equipe duas vezes.
  const [enviando, setEnviando] = useState(false);

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormDataState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enviando) return;

    const inscricao = montaInscricao(formDataState, ufesStatus, numParticipantesPorEquipe);

    if (!inscricao.ok) {
      toast.warning(inscricao.erro);
      return;
    }

    setEnviando(true);
    try {
      // Uma requisição só: a API grava a equipe e os participantes juntos, ou nada.
      await api.post("/inscricao", { equipe: inscricao.equipe, participantes: inscricao.participantes });

      toast.success("Inscrição solicitada com sucesso!");
      setFormDataState({});
      setUfesStatus(Object.fromEntries(Array.from({ length: numParticipantesPorEquipe }, (_, i) => [i + 1, true])));
    } catch (err) {
      // A API explica o motivo (inscrições fechadas, equipe grande demais, limite
      // de tentativas). Nada foi gravado, então dá para corrigir e enviar de novo.
      const motivo = isAxiosError(err) ? err.response?.data?.error ?? err.response?.data?.message : undefined;
      toast.error(motivo ?? "Não foi possível enviar a inscrição. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  };

  const valor = (campo: string) => (formDataState[campo] as string) || "";
  const ehUfes = (i: number) => ufesStatus[i] ?? true;

  const participantesForm = [];

  for (let index = 1; index <= numParticipantesPorEquipe; index++) {
    const romano = ROMANOS[index - 1] ?? String(index);

    participantesForm.push(
      <fieldset key={index} className="mt-10 min-w-0">
        <legend className="mb-4 flex flex-wrap items-baseline gap-x-3">
          <span aria-hidden className="font-titulo text-xl text-[#FFD935]">participante {romano}</span>
          <span className="sr-only">Participante {index}</span>
          <span className="text-sm text-destaque-claro">{index === 1 ? "(obrigatório)" : "(opcional)"}</span>
        </legend>

        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Campo id={`nome${index}`} rotulo="Nome" leitor={`Nome do participante ${index}`}>
            <input id={`nome${index}`} type="text" autoComplete={index === 1 ? "name" : "off"}
              value={valor("nome" + index)} onChange={e => handleInputChange("nome" + index, e.target.value)} className={CAMPO} />
          </Campo>

          <Campo id={`email${index}`} rotulo="E-mail" leitor={`E-mail do participante ${index}`}>
            <input id={`email${index}`} type="email" autoComplete={index === 1 ? "email" : "off"}
              value={valor("email" + index)} onChange={e => handleInputChange("email" + index, e.target.value)} className={CAMPO} />
          </Campo>

          <Campo id={`cpf${index}`} rotulo="CPF" leitor={`CPF do participante ${index}, para o certificado`}>
            <input id={`cpf${index}`} type="text" inputMode="numeric" autoComplete="off"
              value={valor("cpf" + index)} onChange={e => handleInputChange("cpf" + index, e.target.value)} className={CAMPO} />
          </Campo>

          <Campo id={`curso${index}`} rotulo="Curso" leitor={`Curso do participante ${index}, se for universitário`}>
            <input id={`curso${index}`} type="text"
              value={valor("curso" + index)} onChange={e => handleInputChange("curso" + index, e.target.value)} className={CAMPO} />
          </Campo>

          <Campo id={`genero${index}`} rotulo="Gênero" leitor={`Gênero do participante ${index}`}>
            <select id={`genero${index}`} value={valor("genero" + index) || "feminino"}
              onChange={e => handleInputChange("genero" + index, e.target.value)} className={CAMPO}>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="outros">Outros</option>
            </select>
          </Campo>

          <Campo id={`ufes${index}`} rotulo="Estuda na Ufes" leitor={`O participante ${index} estuda na Ufes?`}>
            <select id={`ufes${index}`} value={ehUfes(index) ? "sim" : "nao"}
              onChange={e => setUfesStatus(prev => ({ ...prev, [index]: e.target.value === "sim" }))} className={CAMPO}>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </Campo>

          {!ehUfes(index) && (
            <Campo id={`instituicao${index}`} rotulo="Instituição" leitor={`Instituição de ensino do participante ${index}`}>
              <input id={`instituicao${index}`} type="text"
                value={valor("instituicao" + index)} onChange={e => handleInputChange("instituicao" + index, e.target.value)} className={CAMPO} />
            </Campo>
          )}
        </div>
      </fieldset>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[555px] flex-col">
      <Campo id="equipe" rotulo="Nome da equipe" leitor="Nome da equipe">
        <input id="equipe" type="text" value={valor("equipe")}
          onChange={e => handleInputChange("equipe", e.target.value)} className={`${CAMPO} sm:max-w-[261px]`} />
      </Campo>

      {participantesForm}

      {/* A LGPD pede que a finalidade do dado seja dita na hora da coleta. */}
      <p className="mt-10 text-sm leading-snug text-destaque-claro">
        Pedimos o CPF só para emitir o certificado de participação, feito pela
        Pró-Reitoria de Extensão (PROEX) da Ufes. Ele é visto apenas pela
        organização do Game Jam, não aparece em nenhuma página do site e é apagado
        depois que os certificados são emitidos.
      </p>

      <div className="mt-4 flex items-start gap-3">
        <input
          id="termo"
          type="checkbox"
          checked={(formDataState["termo"] as boolean) || false}
          onChange={e => handleInputChange("termo", e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#FFCF00]"
        />
        <label htmlFor="termo" className="text-sm leading-snug text-destaque-claro">
          Declaro que há pelo menos alguém do grupo que poderá comparecer à Ufes
          para receber a premiação, e caso contrário, estou ciente que não haverá
          premiação física.
        </label>
      </div>

      {/* Botao do mockup: 377x61, #FFCF00, cantos de 21px, texto em PacFont 20. */}
      <button
        type="submit"
        disabled={enviando}
        className="mx-auto mt-10 h-[61px] w-full max-w-[377px] rounded-[21px] bg-[#FFCF00] font-titulo text-xl text-[#001059] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {enviando ? "enviando..." : "inscrever-se"}
      </button>
    </form>
  );
}

const ROMANOS = ["i", "ii", "iii", "iv", "v", "vi"];

// Campo do mockup: 42px de altura, #FCECA8, sem cantos arredondados.
const CAMPO = "h-[42px] w-full bg-[#FCECA8] px-3 text-black outline-none focus:ring-2 focus:ring-[#FFCF00]";

// Rotulo em PacFont 16, #FBDC70, como no mockup. O leitor de tela ouve o texto
// completo, com o numero do participante.
function Campo({ id, rotulo, leitor, children }: { id: string; rotulo: string; leitor: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id}>
        <span aria-hidden className="font-titulo text-base lowercase text-[#FBDC70]">{rotulo}</span>
        <span className="sr-only">{leitor}</span>
      </label>
      {children}
    </div>
  );
}
