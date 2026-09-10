"use client"

import { api } from "@/services/api";
import { toast } from "sonner";
import { useState } from "react";
import { Equipe } from "@/models/Equipes";
import { Participante } from "@/models/Participantes";

interface FormInscricaoProps {
  numParticipantesPorEquipe: number;
}

interface ParticipanteForm {
  nome: string;
  email: string;
  cpf: string;
  curso?: string;
  genero: string;
  ufes: boolean;
  instituicao?: string;
  termo: boolean;
}

export default function FormInscricao({ numParticipantesPorEquipe }: FormInscricaoProps) {
  const [formDataState, setFormDataState] = useState<{ [key: string]: string | boolean }>({});
  const [ufesStatus, setUfesStatus] = useState<{ [key: number]: boolean }>(
    Object.fromEntries(Array.from({ length: numParticipantesPorEquipe }, (_, i) => [i + 1, true]))
  );

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormDataState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const listaParticipantes: ParticipanteForm[] = [];

    const nomeEquipe = (formDataState["equipe"] as string)?.trim() || "";

    if (!nomeEquipe) {
      toast.warning("Preencha o nome da equipe!");
      return;
    }

    const termo = (formDataState["termo"] as boolean) || false;

    if (!termo) {
      toast.warning("Você deve aceitar o termo para realizar a inscrição!");
      return;
    }

    for (let index = 1; index <= numParticipantesPorEquipe; index++) {
      const nome = (formDataState["nome" + index] as string)?.trim() || "";
      const email = (formDataState["email" + index] as string)?.trim() || "";
      const cpf = (formDataState["cpf" + index] as string)?.trim() || "";
      const curso = (formDataState["curso" + index] as string)?.trim() || "";
      const genero = (formDataState["genero" + index] as string) || "feminino";
      const ufes = ufesStatus[index];
      const instituicao = (formDataState["instituicao" + index] as string)?.trim() || "";
      const termo = (formDataState["termo" + index] as boolean) || false;

      if ((!nome || !email || !cpf) && (index == 1)) {
        toast.warning(`Participante ${index}: Nome, CPF e Email são obrigatórios!`);
        return;
      }

      if (!termo && (index == 1)) {
        toast.warning(`Participante ${index} deve aceitar o termo!`);
        return;
      }

      if(nome && email && cpf && termo) {
        listaParticipantes.push({
          nome,
          email,
          cpf,
          curso: curso || undefined,
          genero,
          ufes,
          instituicao: ufes ? undefined : instituicao || undefined,
          termo,
        });
      }
    }

    try {
      const equipe = await Equipe.cadastrar(nomeEquipe);

      if (!equipe?.getId) {
        toast.error("Não foi possível criar a equipe.");
        return;
      }

      for (const p of listaParticipantes) {
        await Participante.cadastrar({
          nome: p.nome,
          email: p.email,
          genero: p.genero,
          ufes: p.ufes,
          cpf: p.cpf,
          curso: p.curso,
          instituicao: p.instituicao,
          equipeId: equipe.getId,
        });
      }

      toast.success("Inscrição solicitada com sucesso!");
      setFormDataState({});
      setUfesStatus(Object.fromEntries(Array.from({ length: numParticipantesPorEquipe }, (_, i) => [i + 1, true])));
    } catch (err: any) {
      console.error("Erro na submissão:", err.response?.data || err);
      toast.error("Erro ao solicitar inscrição. Veja o console para detalhes.");
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
          placeholder="CPF"
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
              value={ufesStatus[index] ? "sim" : "nao"}
              onChange={e => setUfesStatus(prev => ({ ...prev, [index]: e.target.value === "sim" }))}
              className="bg-gray-200 text-black rounded pl-3 pr-3 py-1 appearance-none"
            >
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
        </div>

        {!ufesStatus[index] && (
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
        <div className="flex items-start gap-2 mt-8">
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
          className="mt-11 bg-gray-200 text-black p-3 rounded-lg w-max mx-auto font-bold hover:scale-105 duration-300"
        >
          Solicitar inscrição
        </button>
      </form>
    </div>
  );
}
