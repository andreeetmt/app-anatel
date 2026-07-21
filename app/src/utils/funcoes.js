import { w_to_dBm, dBm_to_w } from "./converter";
import { ganho_gaussian } from "./gaussiano";
import { eirp, eirp_Slim } from "./calc_eirp";
import { slim } from "./calc_slim";

// Helper: valida se um número é utilizável (não NaN, não Infinity)
function numeroValido(n) {
    return typeof n === "number" && isFinite(n);
}

// Extrai e valida os campos numéricos de uma torre.
// Retorna null se algum campo essencial for inválido (em vez de deixar
// NaN se propagar silenciosamente pelo resto do cálculo).
function extrairDadosTorre(dt) {
    const {
        FreqTxMHz: freq,
        GanhoAntena: gTx,
        PotenciaTransmissorWatts: pTx,
        Azimute: azi,
        AnguloElevacao: elev,
        AnguloMeiaPotenciaAntena: meia,
    } = dt;

    const freqTx = parseFloat(freq);
    const gtx = parseFloat(gTx);
    const ptx = parseFloat(pTx);
    const azimute = parseFloat(azi);
    const elevacao = parseFloat(elev);
    const meia_pot = parseFloat(meia);

    if (
        !numeroValido(freqTx) ||
        !numeroValido(gtx) ||
        !numeroValido(ptx) ||
        !numeroValido(azimute) ||
        !numeroValido(elevacao) ||
        !numeroValido(meia_pot) ||
        freqTx <= 0 ||
        ptx <= 0
    ) {
        console.warn(
            "Torre com dados inválidos, ignorada no cálculo:",
            dt.NumEstacao,
            dt.EnderecoEstacao,
            { freqTx, gtx, ptx, azimute, elevacao, meia_pot }
        );
        return null;
    }

    return { freqTx, gtx, ptx, azimute, elevacao, meia_pot };
}

// Calcula a contribuição (EIRP/Slim) de uma única torre.
// Retorna null se o resultado intermediário for inválido.
function contribuicaoTorre(dt) {
    const dados = extrairDadosTorre(dt);
    if (!dados) return null;

    const { freqTx, gtx, ptx } = dados;

    const ptxdBm = w_to_dBm(ptx);
    const ganho = gtx;
    const vEIRP = eirp(ptxdBm, ganho);
    const eirpW = dBm_to_w(vEIRP);
    const vSlim = slim(freqTx);

    if (!numeroValido(eirpW) || !numeroValido(vSlim) || vSlim <= 0) {
        console.warn(
            "Cálculo intermediário inválido para torre, ignorada:",
            dt.NumEstacao,
            { eirpW, vSlim }
        );
        return null;
    }

    return { eirpW, vSlim };
}

// Função para calcular o raio de alcance com base nos dados fornecidos
function calculo_R(valor) {
    let somatoria = 0;

    if (Array.isArray(valor)) {
        valor.forEach(subArray => {
            if (Array.isArray(subArray)) {
                subArray.forEach(dt => {
                    const contrib = contribuicaoTorre(dt);
                    if (!contrib) return; // pula torre inválida, não contamina a somatória

                    const resultado = eirp_Slim(contrib.eirpW, contrib.vSlim);
                    if (numeroValido(resultado)) {
                        somatoria += resultado;
                    }
                });
            } else {
                console.error("Elemento de valor não é um array:", subArray);
            }
        });
    } else {
        console.error("Valor não é um array:", valor);
        return 0;
    }

    let result = somatoria / (4 * Math.PI);
    return Math.sqrt(Math.max(result, 0)); // Math.max evita sqrt de negativo
}

// Função para calcular a Taxa de Exposição de Radiação (TER)
function TER(valor, raio) {
    let somatoria = 0;

    if (Array.isArray(valor)) {
        valor.forEach(subArray => {
            if (Array.isArray(subArray)) {
                subArray.forEach(dado => {
                    const contrib = contribuicaoTorre(dado);
                    if (!contrib) return; // pula torre inválida

                    const result =
                        (contrib.eirpW / (4 * Math.PI * raio * raio)) / contrib.vSlim;

                    if (numeroValido(result)) {
                        somatoria += result;
                    }
                });
            } else {
                console.error("Elemento de valor não é um array:", subArray);
            }
        });
    } else {
        console.log("Valor não é um array:", valor);
    }

    return somatoria;
}

// Função para determinar a cor com base no valor de TER
function corRaio(cor) {
    // Trata NaN/Infinity explicitamente antes das faixas normais,
    // para não cair silenciosamente no "else" genérico
    if (!numeroValido(cor)) {
        console.warn("TER inválido (NaN/Infinity), usando cor padrão:", cor);
        return [200, 200, 200, 0.5]; // Cinza padrão - dado insuficiente
    }

    if (cor > 1) {
        return [255, 0, 0, 0.8];
    } else if (0.5 < cor && cor <= 1) {
        return [255, 69, 0, 0.8];
    } else if (0.35 < cor && cor <= 0.5) {
        return [255, 140, 0, 0.8];
    } else if (0.2 < cor && cor <= 0.35) {
        return [255, 215, 0, 0.8];
    } else if (0.15 < cor && cor <= 0.2) {
        return [173, 255, 47, 0.8];
    } else if (0.08 < cor && cor <= 0.15) {
        return [50, 205, 50, 0.8];
    } else if (0.04 < cor && cor <= 0.08) {
        return [0, 128, 0, 0.8];
    } else if (0.02 < cor && cor <= 0.04) {
        return [0, 191, 255, 0.8];
    } else if (0.01 < cor && cor <= 0.02) {
        return [30, 144, 255, 0.8];
    } else {
        // cor <= 0.01
        return [30, 144, 255, 0.8];
    }
}

// Função para filtrar e retornar apenas cores únicas da lista
function filtrarCoresUnicas(listaCor) {
    let coresUnicas = [];
    let coresVistas = new Set();

    for (let item of listaCor) {
        if (item.cor && Array.isArray(item.cor)) {
            let corString = item.cor.join(',');
            if (!coresVistas.has(corString)) {
                coresUnicas.push(item);
                coresVistas.add(corString);
            }
        } else {
            console.log("Cor indefinida ou não é um array:", item.cor);
        }
    }

    return coresUnicas;
}

// Função para calcular o alcance das torres e determinar a cor correspondente
function alcanceTorre(dados) {
    let listaCor = [];

    for (let i = -1; i < 130; i++) {
        let valor = dados;

        // Garante que o raio nunca fique negativo ou zero (Circle não aceita radius <= 0)
        let raio = Math.max(calculo_R(valor) + i, 0.1);

        let ter = TER(valor, raio);
        let ter_por = numeroValido(ter) ? Math.round(ter * 100) : 0;
        let cor = corRaio(ter);

        listaCor.push({ cor, raio, ter_por });
    }

    return filtrarCoresUnicas(listaCor);
}

export { calculo_R, TER, alcanceTorre };