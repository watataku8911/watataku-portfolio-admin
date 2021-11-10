/*-------------------------------------------------
引数:なし
戻り値:ランダム文字列16桁
----------------------------------------------------*/
export const genalateRandomFileName = () => {
  const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const N = 16;
  const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N)))
    .map((n) => S[n % S.length])
    .join("");
  return fileName;
};
