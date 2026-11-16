/* mevsim-urun-takvimi — Mevsim Ürün Takvimi — ürün × 12 ay sezon bantları, bu ay vurgusu ve ay süzgeci (16 Kas 2026 · mcp:webmaker/20261116-181132-t332 · D17).
   Satırlar ürünler (ikon, ad, not), sütunlar 12 ay (sayfa dilinde kısa ad); sezondaki aylar kesintisiz yuvarlak uçlu bantla, en lezzetli (zirve) aylar koyu tonla boyanır. Bu ayın sütunu vurgulanır; ay başlığına ya da «Bu ay taze» düğmesine basınca yalnız o ayda sezonda olan ürünler kalır. Kayıt alanları: `aylar` («6-9», «11-2», [3, 4, 5]) · `zirve`. JS yokken tablo tam.
   Üretici: scripts/modul-fabrika (aile module) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: ust · baslik · metin · img · img2 · cta_ad/cta_url · cta2_ad/cta2_url; data (maddeler): [{ ikon?, baslik, metin?, url? }] — metinler dil sözlüğü. */
const P = "modulex-mevsim-urun-takvimi";
const IMG_KOK = `/img/${json.id}/`;
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: module --- */
const yeniMadde = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), baslik: metinAl(o, ["baslik", "name", "title"]),
  metin: metinAl(o, ["metin", "text", "description", "spot"]), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
/* module-1 eski şeması: name2/spot2/icon2 … name4 → madde */
const eskiMadde = [2, 3, 4].map((n) => ({ ikon: ikonAd(des["icon" + n]), baslik: metinAl(des, ["name" + n]), metin: metinAl(des, ["spot" + n]), url: "" })).filter((k) => k.baslik);
const kayitlar = yeniMadde.length ? yeniMadde : eskiMadde;
const G1 = medyaUrl(ilk(des, ["img", "image"]));
const G2 = medyaUrl(ilk(des, ["img2", "image2"]));
const gH = (src, s, w, h) => (src ? `<img class="${P}-${s}" src="${esc(src)}" alt="" width="${w || 1200}" height="${h || 900}" loading="lazy" decoding="async" />` : "");
const ustH = (B) => (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "");
const basH = (B) => (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "");
const metH = (B) => (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "");
const listeH = (ic) => (ic ? `<ul class="${P}-maddeler" role="list">${ic}</ul>` : "");
const maddeVar = (k, i) => `<li class="${P}-madde">${ikonH(k.ikon || "check_circle", `${P}-mikon`)}<div class="${P}-myazi"><h3 class="${P}-mbaslik">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</h3>${k.metin ? `<p class="${P}-mmetin">${satirlar(k.metin)}</p>` : ""}</div></li>`;
/* --- modül: mevsim-urun-takvimi --- */
const kart = () => "";
const sar = (ic, A, B) => {
    const R = yeniMadde.length ? veri.filter((o) => metinAl(o, ["baslik", "name", "title"])) : [];
    const ay = (i, ks) => {
      const out = new Set();
      const v = R[i] ? ilk(R[i], ks) : "";
      const parca = Array.isArray(v) ? v.map(String) : typeof v === "number" ? [String(v)] : String(pick(v) || "").split(",");
      parca.forEach((p) => {
        const m = /^\s*(\d{1,2})\s*(?:[-–]\s*(\d{1,2}))?\s*$/.exec(p);
        if (!m) return;
        const a = Number(m[1]);
        const b = m[2] ? Number(m[2]) : a;
        if (a < 1 || a > 12 || b < 1 || b > 12) return;
        for (let k = a, n = 0; n < 12; k = (k % 12) + 1, n++) { out.add(k); if (k === b) break; }
      });
      return out;
    };
    const ayAd = (m) => { try { return new Intl.DateTimeFormat(dil || undefined, { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, m - 1, 15))); } catch (e) { return String(m); } };
    const VA = metinAl(des, ["varAd"]);
    const ZA = metinAl(des, ["zirveAd"]);
    const BA = metinAl(des, ["buAyAd"]);
    const M12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const U = A.map((k, i) => ({ k, S: ay(i, ["aylar", "sezon", "months"]), Z: ay(i, ["zirve", "peak"]) }));
    const hucre = (u, m) => {
      if (!u.S.has(m)) return `<td data-m="${m}"></td>`;
      const on = m > 1 && u.S.has(m - 1);
      const son = m < 12 && u.S.has(m + 1);
      const z = u.Z.has(m);
      return `<td data-m="${m}"><span class="${P}-bant${z ? ` ${P}-bant--zirve` : ""}${on ? "" : ` ${P}-bant--bas`}${son ? "" : ` ${P}-bant--son`}"></span><span class="${P}-gizli">${esc(z ? ZA || VA || "✓" : VA || "✓")}</span></td>`;
    };
    const lejant = VA || ZA ? `<div class="${P}-lejant">${VA ? `<span class="${P}-lj"><i class="${P}-bant ${P}-bant--bas ${P}-bant--son" aria-hidden="true"></i>${esc(VA)}</span>` : ""}${ZA ? `<span class="${P}-lj"><i class="${P}-bant ${P}-bant--zirve ${P}-bant--bas ${P}-bant--son" aria-hidden="true"></i>${esc(ZA)}</span>` : ""}${BA ? `<button type="button" class="${P}-buay" data-buay aria-pressed="false" hidden>${ikonH("today", "")}${esc(BA)}</button>` : ""}</div>` : "";
    const tablo = `<div class="${P}-tkap"><table class="${P}-takvim"${B.baslik ? ` aria-labelledby="${P}-{{id}}-b"` : ""}><thead><tr><th scope="col" class="${P}-kose">${esc(metinAl(des, ["urunAd"]))}</th>${M12.map((m) => `<th scope="col" data-m="${m}"><button type="button" class="${P}-ay" data-ay="${m}" aria-pressed="false">${esc(ayAd(m))}</button></th>`).join("")}</tr></thead><tbody>${U.map((u) => `<tr data-aylar="${[...u.S].join(",")}"><th scope="row"><span class="${P}-urun">${ikonH(u.k.ikon, `${P}-uik`)}<span class="${P}-uyazi"><strong class="${P}-uad">${u.k.url ? `<a class="${P}-bag" href="${esc(u.k.url)}">${esc(u.k.baslik)}</a>` : esc(u.k.baslik)}</strong>${u.k.metin ? `<small class="${P}-unot">${satirlar(u.k.metin)}</small>` : ""}</span></span></th>${M12.map((m) => hucre(u, m)).join("")}</tr>`).join("")}</tbody></table><p class="${P}-tyok" data-tyok hidden>@no-results@</p></div>`;
    return `<div class="${P}-giris">${ustH(B)}${basH(B)}${metH(B)}</div>${lejant}${tablo}${ctaHtml()}`;
  };
const B = { ust: metinAl(des, ["ust","title","badge"]), baslik: metinAl(des, ["baslik","name"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik && !B.metin;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
