
// Função para calcular o ganho da antena em dBm
// Baseada em ITU-R M.2101-0, Seção 5.1, Tabela 3
//
// Parâmetros:
//   ganho  - GE,max: ganho máximo do elemento (dBi)
//   az     - azimute do ponto observado (graus, 0-360)
//   az_z   - azimute de apontamento da antena (graus, 0-360)
//   el     - elevação do ponto observado (graus)
//   el_z   - downtilt / elevação de apontamento da antena (graus)
//   meia   - largura de feixe horizontal de 3dB / 2, ou phi3dB (confirme a convenção
//            usada no restante do seu código - "meia" sugere meia-largura)
//   theta3dB - (NOVO) largura de feixe vertical de 3dB da antena. Antes fixo em 7.
//   Am      - (NOVO, opcional) relação frente-costas, dB. Default 30 (típico ITU).
//   SLAv    - (NOVO, opcional) nível de lóbulo lateral vertical, dB. Default 30.
export function ganho_gaussian(ganho, az, az_z, el, el_z, meia, theta3dB = 7, Am = 30, SLAv = 30) {
  // 1. Normaliza a diferença de azimute para o intervalo [-180, 180]
  //    (corrige o bug original que só tratava diff > 180, não diff < -180)
  let diffAz = az - az_z;
  if (diffAz > 180) diffAz -= 360;
  if (diffAz < -180) diffAz += 360;
 
  // 2. Padrão horizontal, com clamp individual em Am (ITU Tabela 3)
  const perdaHorizontal = Math.min(12 * (diffAz / meia) ** 2, Am);
 
  // 3. Padrão vertical, com clamp individual em SLAv (ITU Tabela 3)
  const perdaVertical = Math.min(12 * ((el - el_z) / theta3dB) ** 2, SLAv);
 
  // 4. Combina e aplica o clamp final em Am (piso de ganho = ganho - Am)
  const perdaTotal = Math.min(perdaHorizontal + perdaVertical, Am);
  const resultado = ganho - perdaTotal;
 
  return resultado;
}
 