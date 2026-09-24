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

  const participantesForm = [];

  for (let index = 1; index <= numParticipantesPorEquipe; index++) {
    participantesForm.push(
      <div key={index} className="mt-12 flex flex-col gap-5">
        <span className="text-xl font-bold">Participante {index} {index === 1 ? "(Obrigatório)" : ''}</span>

        <input
          type="text"
          placeholder="Nome"
          value={(formDataState["nome" + index] as string) || ""}
          onChange={e => handleInputChange("nome" + index, e.target.value)}
          className="w-full h-11 bg-gray-200 text-black p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={(formDataState["email" + index] as string) || ""}
          onChange={e => handleInputChange("email" + index, e.target.value)}
          className="w-full h-11 bg-gray-200 text-black p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="CPF (para o certificado)"
          value={(formDataState["cpf" + index] as string) || ""}
          onChange={e => handleInputChange("cpf" + index, e.target.value)}
          className="w-full h-11 bg-gray-200 text-black p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Curso (se for universitário)"
          value={(formDataState["curso" + index] as string) || ""}
          onChange={e => handleInputChange("curso" + index, e.target.value)}
          className="w-full h-11 bg-gray-200 text-black p-3 rounded-lg"
        />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label>Gênero:</label>
            <select
              value={(formDataState["genero" + index] as string) || "feminino"}
              onChange={e => handleInputChange("genero" + index, e.target.value)}
              className="bg-gray-200 text-black rounded pl-3 pr-3 py-1 appearance-none"
            >
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label>É estudante da Ufes?</label>
            <select
              value={(ufesStatus[index] ?? true) ? "sim" : "nao"}
              onChange={e => setUfesStatus(prev => ({ ...prev, [index]: e.target.value === "sim" }))}
              className="bg-gray-200 text-black rounded pl-3 pr-3 py-1 appearance-none"
            >
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
        </div>

        {!(ufesStatus[index] ?? true) && (
          <input
            type="text"
            placeholder="Instituição de Ensino"
            value={(formDataState["instituicao" + index] as string) || ""}
            onChange={e => handleInputChange("instituicao" + index, e.target.value)}
            className="w-full h-11 bg-gray-200 text-black p-3 rounded-lg"
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-h-none overflow-visible lg:max-h-screen lg:overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full lg:w-[80%] mx-auto"
      >
        <label className="mb-3 text-xl font-bold">
          Qual o nome da sua equipe?
        </label>

        <input
          type="text"
          value={(formDataState["equipe"] as string) || ""}
          onChange={e => handleInputChange("equipe", e.target.value)}
          className="w-full h-11 bg-gray-200 text-black p-3 rounded-lg"
        />

        {participantesForm}

        {/* A LGPD pede que a finalidade do dado seja dita na hora da coleta. */}
        <p className="mt-8 text-sm leading-snug">
          Pedimos o CPF só para emitir o certificado de participação, feito pela
          Pró-Reitoria de Extensão (PROEX) da Ufes. Ele é visto apenas pela
          organização do Game Jam e não aparece em nenhuma página do site.
        </p>
        <div className="flex items-start gap-2 mt-4">
          <input
            type="checkbox"
            checked={(formDataState["termo"] as boolean) || false}
            onChange={e => handleInputChange("termo", e.target.checked)}
            className="mt-1"
          />

          <label className="text-sm leading-snug">
            Declaro que há pelo menos alguém do grupo que poderá comparecer à Ufes
            para receber a premiação, e caso contrário, estou ciente que não haverá
            premiação física.
          </label>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="mt-11 bg-gray-200 text-black p-3 rounded-lg w-max mx-auto font-bold hover:scale-105 duration-300 disabled:opacity-60 disabled:hover:scale-100"
        >
          {enviando ? "Enviando..." : "Solicitar inscrição"}
        </button>
      </form>
    </div>
  );
}
