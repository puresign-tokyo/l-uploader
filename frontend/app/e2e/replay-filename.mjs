// backend/src/filename.pyと同じ4桁の小文字36進数。zzzzの次は0000に戻る。
export function replayFilename(prefix, replayId) {
  const radix = 36;
  const width = 4;
  const id = (replayId % radix ** width).toString(radix).padStart(width, "0");
  return `${prefix}_ud${id}.rpy`;
}
