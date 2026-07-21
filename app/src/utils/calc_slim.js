export function slim(valor) {
    if (valor === null || valor === undefined || isNaN(valor) || valor <= 0) {
        return null;
    }
    if (valor >= 2000) {
        return 10;
    }
    return valor / 200;
}