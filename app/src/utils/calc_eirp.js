export function eirp(ptxWatts, gtxDbi) {
  if (!isFinite(ptxWatts) || ptxWatts <= 0 || !isFinite(gtxDbi)) {
    return null;
  }
  const ptxDbm = 10 * Math.log10(ptxWatts * 1000);
  return ptxDbm + gtxDbi;
}

export function eirp_Slim(eirp, slim) {
    if (!slim || slim <= 0 || !isFinite(eirp)) {
        return null;
    }
    return eirp / slim;
}