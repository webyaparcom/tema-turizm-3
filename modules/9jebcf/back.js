/* surec-adim-sihirbaz — Süreç Adım Sihirbazı — tek tek ilerleyen adım sayfaları (16 Kas 2026 · mcp:webmaker/20261116-181132-t332 · D17).
   Başvuru sihirbazı gibi: üstte numaralı adım pilleri ve dolan ilerleme çubuğu, ortada tek bir büyük adım sayfası (dev numara, etiket, başlık, açıklama, süre; yanında görsel ya da ikon karosu), altta Önceki / Sonraki düğmeleri ve «2 / 4» sayacı. Etkin olmayan sayfalar inert ve gizlidir; yükseklik en uzun sayfaya sabitlenir (zıplama yok). JS yokken tüm adımlar alt alta kart listesi, gezinti gizli.
   Üretici: scripts/modul-fabrika (aile surec) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: data: [{ baslik, metin?, ikon?, sure?, no?, img?, url? }] — metinler dil sözlüğü; başlıksız adım atlanır. desing `adimEtiket` (eski `stepLabel`) «Adım {n}» kalıbı. */
const P = "modulex-surec-adim-sihirbaz";
const IMG_KOK = "/img/";
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
/* --- aile: surec --- */
const kaynak = veri.length ? veri : (json.data && Array.isArray(json.data.adimlar) ? json.data.adimlar : (Array.isArray(des.adimlar) ? des.adimlar : []));
const adimKalip = metinAl(des, ["adimEtiket", "stepLabel"]);
const kayitlar = kaynak.map((o) => ({
  no: String(ilk(o, ["no", "numara"]) || "").trim(), baslik: metinAl(o, ["baslik", "title", "name", "ad"]),
  metin: metinAl(o, ["metin", "text", "description", "aciklama", "ozet"]), ikon: ikonAd(ilk(o, ["ikon", "icon"])),
  sure: metinAl(o, ["sure", "duration", "zaman"]), img: medyaUrl(ilk(o, ["img", "image", "gorsel"])), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
kayitlar.forEach((k, i) => { k.sira = k.no || no(i); k.etiket = adimKalip ? adimKalip.replace(/\{n\}/g, k.no || String(i + 1)) : ""; });
const bH = (k, s, t) => `<${t || "h3"} class="${P}-${s || "kbaslik"}">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</${t || "h3"}>`;
const mH = (k, s) => (k.metin ? `<p class="${P}-${s || "kmetin"}">${satirlar(k.metin)}</p>` : "");
const eH = (k, s) => (k.etiket ? `<p class="${P}-${s || "etiket"}">${esc(k.etiket)}</p>` : "");
const sH = (k) => (k.sure ? `<p class="${P}-sure"><span class="material-symbols-outlined" aria-hidden="true">schedule</span>${esc(k.sure)}</p>` : "");
const gH = (k, s) => (k.img ? `<img class="${P}-${s || "gorsel"}" src="${esc(k.img)}" alt="" width="800" height="560" loading="lazy" decoding="async" />` : "");
/* --- modül: surec-adim-sihirbaz --- */
const kart = (k, i) => `<li class="${P}-sayfa${i === 0 ? ` ${P}-sayfa--etkin` : ""}" data-sh><div class="${P}-syazi"><span class="${P}-dev" aria-hidden="true">${esc(k.sira)}</span>${eH(k)}${bH(k)}${mH(k)}${sH(k)}</div>${k.img ? `<div class="${P}-sgorsel">${gH(k)}</div>` : `<div class="${P}-sgorsel ${P}-sgorsel--ikon" aria-hidden="true">${ikonH(k.ikon || "flag", `${P}-sikon`)}</div>`}</li>`;
const sar = (ic, A) => {
    const pil = A.map((k, i) => `<li class="${P}-pilk"><button type="button" class="${P}-pil" data-sh-git="${i}"><span class="${P}-pno">${esc(k.sira)}</span><span class="${P}-pad">${esc(k.baslik)}</span></button></li>`).join("");
    return `<div class="${P}-sihirbaz" data-sh-kok style="--sh: 0"><div class="${P}-serit"><span class="${P}-cubuk" aria-hidden="true"><span class="${P}-cdolgu"></span></span><ol class="${P}-piller">${pil}</ol></div><ol class="${P}-sayfalar">${ic}</ol>`
      + `<div class="${P}-gezinti"><button type="button" class="${P}-yon" data-sh-yon="geri"><span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_back</span><span>@previous@</span></button><p class="${P}-sayac" aria-live="polite"><bdi dir="ltr" data-sh-say>${sayiBicim(1, 0)} / ${sayiBicim(A.length, 0)}</bdi></p><button type="button" class="${P}-yon ${P}-yon--ileri" data-sh-yon="ileri"><span>@next@</span><span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></button></div></div>`;
  };
const B = { ust: metinAl(des, ["ust","eyebrow","badge","kicker"]), baslik: metinAl(des, ["baslik","title"]), metin: metinAl(des, ["metin","description","aciklama"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !kayitlar.length;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = basHtml(B, "");
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
