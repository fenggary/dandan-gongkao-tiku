/* 客户端访问门禁（基础防路人类；高安全性需私有仓库部署）。
   校验凭据以加盐混淆形式保存，代码库中不出现明文口令或标准哈希。 */
(function () {
  // 两段混淆片段：需运行时重组并还原后与"盐+输入"的摘要比对
  const _SALT = "dandan2026!@#";
  const _K1 = "b361e0e84d3acb111eb01d1801402041";
  const _K2 = "6b75bd92aaf98025d5d76e26a8c64b7c";
  const KEY = "dandan_unlocked";

  function _deobf(h) {
    // 逐字节 XOR 0x5A 还原真实摘要
    const out = [];
    for (let i = 0; i < h.length; i += 2) {
      out.push(String.fromCharCode(parseInt(h.substr(i, 2), 16) ^ 0x5A));
    }
    return out.map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
  }

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  window.unlock = async function () {
    const v = document.getElementById("lockInput").value.trim();
    if (!v) return;
    const expect = _deobf(_K1 + _K2);
    if ((await sha256(_SALT + v)) === expect) {
      sessionStorage.setItem(KEY, "1");
      hide();
    } else {
      document.getElementById("lockErr").textContent = "密码不正确";
    }
  };

  function hide() { document.getElementById("lock").style.display = "none"; }

  if (sessionStorage.getItem(KEY) === "1") hide();
})();
