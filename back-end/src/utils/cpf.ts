// So os digitos do CPF, se for um CPF valido (11 digitos e os dois digitos
// verificadores certos); senao, null. O CPF vai para o certificado emitido pela
// PROEX: digitado errado, so se descobria na hora de emitir.
export function cpfNormalizado(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const cpf = valor.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return null;

  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    if (((soma * 10) % 11) % 10 !== Number(cpf[tamanho])) return null;
  }
  return cpf;
}
