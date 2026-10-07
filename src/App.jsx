import React, { useState, useMemo, useEffect } from "react";
import {
  Check, Backpack, Tent, Plane, Search, RotateCcw,
  ChevronDown, AlertCircle, Circle, Package
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DATA — final classification from the quiz
   use: "T" (trilha) | "V" (viagem) | "T-V" (ambos)
   req: true = obrigatório, false = opcional
   ───────────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    name: "Documentos, Dinheiro & Essenciais",
    items: [
      ["Documento com foto (RG/CNH) + cópias", "T-V", true],
      ["Dinheiro em espécie", "T-V", true],
      ["Cartão de débito/crédito", "T-V", true],
      ["Celular", "T-V", true],
      ["Comprovantes de reserva/passagens", "V", true],
      ["Carregador + cabo do celular", "T-V", true],
      ["Powerbank", "T-V", true],
      ["Chaves (casa/carro)", "T-V", true],
      ["Adaptador de tomada", "V", true],
      ["Fone de ouvido", "T-V", true],
      ["Kindle", "V", false],
      ["Cadeado (bagagem/alojamento)", "T-V", false],
    ],
  },
  {
    name: "Higiene & Limpeza",
    items: [
      ["Escova + Pasta de dente", "T-V", true],
      ["Sabonete", "T-V", true],
      ["Shampoo", "T-V", true],
      ["Desodorante", "T-V", true],
      ["Toalha de rosto", "T-V", true],
      ["Papel higiênico", "T-V", true],
      ["Protetor solar", "T-V", true],
      ["Repelente", "T-V", true],
      ["Pente / escova de cabelo", "T-V", true],
      ["Perfume", "V", true],
      ["Sabão + Esponja", "T-V", true],
      ["Necessaire organizadora", "T-V", true],
      ["Álcool em gel", "T-V", false],
      ["Lenços umedecidos", "T-V", false],
      ["Cortador de unha", "T-V", false],
      ["2 Panos", "T-V", false],
    ],
  },
  {
    name: "Kit Sobrevivência & Utilidades",
    items: [
      ["Faca / Canivete", "T-V", true],
      ["Cantil de água", "T-V", true],
      ["Lanterna comum", "T-V", true],
      ["Fogareiro", "T", true],
      ["Tekgás (cartucho)", "T", true],
      ["Caneca com tirante", "T", true],
      ["Sacolas / sacos plásticos", "T-V", true],
      ["Saco impermeável p/ roupa suja", "T-V", true],
      ["Lanterna de cabeça", "T-V", false],
      ["Isqueiro", "T-V", false],
      ["Fósforos (backup)", "T", false],
      ["Cordas", "T", false],
      ["Capa de chuva", "T-V", false],
      ["Fita adesiva (silver tape)", "T-V", false],
      ["Mosquetões", "T", false],
      ["Tesoura", "T-V", false],
      ["Kit de costura pequeno", "T-V", false],
      ["Cantil de uísque", "T-V", false],
      ["Caderno e caneta", "T-V", false],
    ],
  },
  {
    name: "Kit de Primeiros Socorros",
    items: [
      ["Analgésico / antitérmico", "T-V", true],
      ["Anti-inflamatório", "T-V", true],
      ["Antialérgico", "T-V", true],
      ["Medicamentos de uso contínuo", "T-V", true],
      ["Curativos / band-aids", "T-V", true],
      ["Gaze estéril + esparadrapo", "T-V", true],
      ["Antisséptico", "T-V", true],
      ["Álcool 70% (frasco)", "T-V", true],
      ["Atadura de crepe", "T-V", false],
      ["Luvas descartáveis", "T-V", false],
      ["Antidiarreico", "T-V", false],
      ["Sais de reidratação oral", "T-V", false],
      ["Pomada p/ picadas", "T-V", false],
      ["Pomada cicatrizante", "T-V", false],
      ["Repelente extra + pós-picada", "T", false],
      ["Tesoura sem ponta + pinça", "T-V", false],
      ["Soro fisiológico", "T-V", false],
      ["Protetor labial com FPS", "T-V", false],
    ],
  },
  {
    name: "Estrutura & Containers",
    items: [
      ["Mochila principal", "T-V", true],
      ["Barraca", "T", true],
      ["Estacas da barraca", "T", true],
      ["Saco de dormir", "T", true],
      ["Isolante térmico", "T", true],
      ["Lona", "T", true],
      ["Mochila de ataque", "T", true],
      ["Lençol", "T-V", true],
      ["Travesseiro", "T-V", false],
    ],
  },
  {
    name: "Alimentação (Utensílios)",
    items: [
      ["Talheres", "T-V", true],
      ["Copos", "T-V", true],
      ["Sal", "T", true],
      ["Óleo", "T", true],
      ["Café solúvel", "T-V", true],
      ["Palitos de dente", "T-V", true],
      ["Açúcar", "T-V", true],
      ["Sacos ziploc / potes", "T-V", true],
      ["Pano de prato", "T-V", true],
      ["Frigideira", "T", false],
      ["Cuscuzeira", "T", false],
      ["Tábua pequena de corte", "T", false],
    ],
  },
  {
    name: "Comida",
    items: [
      ["Água (reserva)", "T-V", true],
      ["Granola", "T-V", true],
      ["Frutas", "T-V", true],
      ["Amendoim", "T-V", true],
      ["Bolo cortado", "T-V", true],
      ["Pão de forma", "T-V", true],
      ["Biscoitos", "T-V", true],
      ["Cup Noodles", "T", false],
      ["Salgadinho", "T-V", false],
      ["Goiabada grande", "T-V", false],
    ],
  },
  {
    name: "Vestimentas",
    items: [
      ["Camisas (leves)", "T-V", true],
      ["Calça", "T-V", true],
      ["Roupa íntima", "T-V", true],
      ["Meias", "T-V", true],
      ["Chinelo", "T-V", true],
      ["Short", "T-V", true],
      ["Toalha de banho", "T-V", true],
      ["Chapéu boonie / boné", "T-V", true],
      ["Casaco", "T-V", false],
      ["Roupa de dormir", "T-V", false],
      ["Óculos de sol", "T-V", false],
      ["Bandana / buff", "T", false],
    ],
  },
];

/* stable id per item */
const idOf = (s, i) => `${s}__${i}`;

/* ─────────────────────────────────────────────────────────────
   Persistence helper — safe no-op in the artifact sandbox,
   real localStorage once you deploy.
   ───────────────────────────────────────────────────────────── */
const STORE_KEY = "checklist-viagem-v1";
const loadChecked = () => {
  try {
    const raw = typeof window !== "undefined" && window.localStorage
      ? window.localStorage.getItem(STORE_KEY) : null;
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
};
const saveChecked = (obj) => {
  try {
    if (typeof window !== "undefined" && window.localStorage)
      window.localStorage.setItem(STORE_KEY, JSON.stringify(obj));
  } catch { /* ignore (sandbox) */ }
};

const USE_META = {
  "T":   { label: "Trilha", short: "T",   color: "#2f6f43", bg: "#e7f2ea" },
  "V":   { label: "Viagem", short: "V",   color: "#1d5a8a", bg: "#e6eff6" },
  "T-V": { label: "Ambos",  short: "T/V", color: "#6a4a86", bg: "#efe9f4" },
};

export default function App() {
  const [checked, setChecked] = useState(loadChecked);
  const [tripFilter, setTripFilter] = useState("all"); // all | T | V
  const [reqFilter, setReqFilter] = useState("all");    // all | req | opt
  const [query, setQuery] = useState("");
  const [hideChecked, setHideChecked] = useState(false);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => saveChecked(checked), [checked]);

  const toggle = (id) =>
    setChecked((c) => ({ ...c, [id]: !c[id] }));

  const matchesTrip = (use) => {
    if (tripFilter === "all") return true;
    if (tripFilter === "T") return use === "T" || use === "T-V";
    if (tripFilter === "V") return use === "V" || use === "T-V";
    return true;
  };

  /* Build filtered sections */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SECTIONS.map((sec) => {
      const items = sec.items
        .map((it, i) => ({ name: it[0], use: it[1], req: it[2], id: idOf(sec.name, i) }))
        .filter((it) => matchesTrip(it.use))
        .filter((it) => reqFilter === "all" || (reqFilter === "req" ? it.req : !it.req))
        .filter((it) => !q || it.name.toLowerCase().includes(q))
        .filter((it) => !hideChecked || !checked[it.id]);
      return { name: sec.name, items };
    }).filter((sec) => sec.items.length > 0);
  }, [tripFilter, reqFilter, query, hideChecked, checked]);

  /* Global stats (respect trip filter, ignore search/hide so numbers are stable) */
  const stats = useMemo(() => {
    let total = 0, done = 0, reqTotal = 0, reqDone = 0;
    SECTIONS.forEach((sec) =>
      sec.items.forEach((it, i) => {
        if (!matchesTrip(it[1])) return;
        const id = idOf(sec.name, i);
        total++;
        if (checked[id]) done++;
        if (it[2]) { reqTotal++; if (checked[id]) reqDone++; }
      })
    );
    return { total, done, reqTotal, reqDone };
  }, [checked, tripFilter]);

  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
  const reqPct = stats.reqTotal ? Math.round((stats.reqDone / stats.reqTotal) * 100) : 0;

  const resetAll = () => {
    if (window.confirm("Desmarcar todos os itens?")) setChecked({});
  };

  return (
    <div style={S.page}>
      <style>{GLOBAL_CSS}</style>

      {/* Header */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <div style={S.brand}>
            <span style={S.brandIcon}><Backpack size={22} strokeWidth={2.2} /></span>
            <div>
              <h1 style={S.h1}>Checklist de Viagem &amp; Trilha</h1>
              <p style={S.sub}>Marque conforme for arrumando a mochila</p>
            </div>
          </div>

          {/* Progress ring-ish bars */}
          <div style={S.progressWrap}>
            <ProgressBadge label="Geral" done={stats.done} total={stats.total} pct={pct} accent="#3f8f5b" />
            <ProgressBadge label="Obrigatórios" done={stats.reqDone} total={stats.reqTotal} pct={reqPct} accent="#d9822b" />
          </div>
        </div>

        {/* Controls */}
        <div style={S.controls}>
          <div style={S.segment}>
            <SegBtn active={tripFilter === "all"} onClick={() => setTripFilter("all")} icon={<Package size={15} />}>Tudo</SegBtn>
            <SegBtn active={tripFilter === "T"} onClick={() => setTripFilter("T")} icon={<Tent size={15} />}>Trilha</SegBtn>
            <SegBtn active={tripFilter === "V"} onClick={() => setTripFilter("V")} icon={<Plane size={15} />}>Viagem</SegBtn>
          </div>

          <div style={S.segment}>
            <SegBtn active={reqFilter === "all"} onClick={() => setReqFilter("all")}>Todos</SegBtn>
            <SegBtn active={reqFilter === "req"} onClick={() => setReqFilter("req")} icon={<AlertCircle size={14} />}>Obrig.</SegBtn>
            <SegBtn active={reqFilter === "opt"} onClick={() => setReqFilter("opt")} icon={<Circle size={13} />}>Opcion.</SegBtn>
          </div>

          <div style={S.searchBox}>
            <Search size={15} style={{ color: "#8a9a8e", flexShrink: 0 }} />
            <input
              style={S.search}
              placeholder="Buscar item…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <label style={S.hideToggle}>
            <input type="checkbox" checked={hideChecked} onChange={(e) => setHideChecked(e.target.checked)} />
            <span>Ocultar marcados</span>
          </label>

          <button style={S.reset} onClick={resetAll} title="Desmarcar todos">
            <RotateCcw size={14} /> Limpar
          </button>
        </div>
      </header>

      {/* Sections */}
      <main style={S.main}>
        {filtered.length === 0 && (
          <div style={S.empty}>
            <Search size={26} style={{ opacity: 0.4 }} />
            <p>Nenhum item corresponde aos filtros.</p>
          </div>
        )}

        {filtered.map((sec) => {
          const secDone = sec.items.filter((it) => checked[it.id]).length;
          const isCollapsed = collapsed[sec.name];
          return (
            <section key={sec.name} style={S.section}>
              <button
                style={S.secHead}
                onClick={() => setCollapsed((c) => ({ ...c, [sec.name]: !c[sec.name] }))}
              >
                <span style={S.secTitle}>{sec.name}</span>
                <span style={S.secMeta}>
                  <span style={S.secCount}>{secDone}/{sec.items.length}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transition: "transform .2s",
                      transform: isCollapsed ? "rotate(-90deg)" : "none",
                      color: "#cfe0d4",
                    }}
                  />
                </span>
              </button>

              {!isCollapsed && (
                <ul style={S.list}>
                  {sec.items.map((it) => {
                    const on = !!checked[it.id];
                    const meta = USE_META[it.use];
                    return (
                      <li key={it.id}>
                        <button
                          style={{ ...S.item, ...(on ? S.itemOn : null) }}
                          onClick={() => toggle(it.id)}
                        >
                          <span style={{ ...S.check, ...(on ? S.checkOn : null) }}>
                            {on && <Check size={14} strokeWidth={3} />}
                          </span>
                          <span style={{ ...S.itemName, ...(on ? S.itemNameOn : null) }}>
                            {it.name}
                          </span>
                          <span style={{ ...S.useTag, color: meta.color, background: meta.bg }}>
                            {meta.short}
                          </span>
                          {it.req ? (
                            <span style={S.reqDot} title="Obrigatório" />
                          ) : (
                            <span style={S.optDot} title="Opcional" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}

        <footer style={S.footer}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={S.reqDot} /> Obrigatório
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={S.optDot} /> Opcional
          </span>
          <span style={{ color: "#9fb0a4" }}>·</span>
          <span>Seu progresso fica salvo neste navegador.</span>
        </footer>
      </main>
    </div>
  );
}

/* ── Small components ─────────────────────────────────────────── */
function ProgressBadge({ label, done, total, pct, accent }) {
  return (
    <div style={S.pBadge}>
      <div style={S.pTop}>
        <span style={S.pLabel}>{label}</span>
        <span style={{ ...S.pPct, color: accent }}>{pct}%</span>
      </div>
      <div style={S.pTrack}>
        <div style={{ ...S.pFill, width: `${pct}%`, background: accent }} />
      </div>
      <span style={S.pCount}>{done} de {total}</span>
    </div>
  );
}

function SegBtn({ active, onClick, children, icon }) {
  return (
    <button style={{ ...S.segBtn, ...(active ? S.segBtnOn : null) }} onClick={onClick}>
      {icon}{children}
    </button>
  );
}

/* ── Styles ───────────────────────────────────────────────────── */
const FOREST = "#1f3d29";
const FOREST_2 = "#2c5238";
const PAPER = "#f5f7f3";

const S = {
  page: { minHeight: "100vh", background: PAPER, color: "#22302a",
    fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 40 },
  header: { background: `linear-gradient(160deg, ${FOREST} 0%, ${FOREST_2} 100%)`,
    color: "#eef4ee", padding: "20px 0 0", position: "sticky", top: 0, zIndex: 10,
    boxShadow: "0 2px 12px rgba(20,45,28,.18)" },
  headerInner: { maxWidth: 820, margin: "0 auto", padding: "0 18px",
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    gap: 20, flexWrap: "wrap" },
  brand: { display: "flex", gap: 12, alignItems: "center" },
  brandIcon: { width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,.12)",
    display: "grid", placeItems: "center", flexShrink: 0 },
  h1: { margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" },
  sub: { margin: "2px 0 0", fontSize: 12.5, color: "#b8ceba" },
  progressWrap: { display: "flex", gap: 14 },
  pBadge: { minWidth: 116 },
  pTop: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 },
  pLabel: { fontSize: 11.5, color: "#c4d8c6", fontWeight: 500 },
  pPct: { fontSize: 15, fontWeight: 700 },
  pTrack: { height: 6, background: "rgba(255,255,255,.15)", borderRadius: 99, marginTop: 4, overflow: "hidden" },
  pFill: { height: "100%", borderRadius: 99, transition: "width .35s cubic-bezier(.4,0,.2,1)" },
  pCount: { fontSize: 10.5, color: "#a9c1ac", marginTop: 3, display: "block" },

  controls: { maxWidth: 820, margin: "16px auto 0", padding: "0 18px 16px",
    display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  segment: { display: "flex", background: "rgba(255,255,255,.10)", borderRadius: 10, padding: 3 },
  segBtn: { display: "inline-flex", alignItems: "center", gap: 5, border: "none",
    background: "transparent", cursor: "pointer", fontSize: 12.5,
    fontWeight: 500, padding: "6px 11px", borderRadius: 7, color: "#c4d8c6",
    fontFamily: "inherit", transition: "all .15s" },
  segBtnOn: { background: "#eef4ee", color: FOREST, fontWeight: 600 },

  searchBox: { display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.92)",
    borderRadius: 9, padding: "0 11px", flex: "1 1 150px", minWidth: 140 },
  search: { border: "none", outline: "none", background: "transparent", padding: "9px 0",
    fontSize: 13.5, width: "100%", color: "#22302a", fontFamily: "inherit" },
  hideToggle: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5,
    color: "#c4d8c6", cursor: "pointer", userSelect: "none" },
  reset: { display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,.25)",
    background: "transparent", color: "#e6efe6", cursor: "pointer", fontSize: 12.5,
    padding: "7px 12px", borderRadius: 9, fontFamily: "inherit", fontWeight: 500 },

  main: { maxWidth: 820, margin: "0 auto", padding: "22px 18px 0" },
  section: { marginBottom: 16, background: "#fff", borderRadius: 14,
    boxShadow: "0 1px 3px rgba(30,50,35,.06)", overflow: "hidden",
    border: "1px solid #e7ede8" },
  secHead: { width: "100%", display: "flex", justifyContent: "space-between",
    alignItems: "center", background: FOREST_2, color: "#fff", border: "none",
    padding: "12px 16px", cursor: "pointer", fontFamily: "inherit" },
  secTitle: { fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.01em", textAlign: "left" },
  secMeta: { display: "flex", alignItems: "center", gap: 10 },
  secCount: { fontSize: 12, color: "#cfe0d4", fontVariantNumeric: "tabular-nums",
    background: "rgba(255,255,255,.12)", padding: "2px 9px", borderRadius: 99 },
  list: { listStyle: "none", margin: 0, padding: 6 },
  item: { width: "100%", display: "flex", alignItems: "center", gap: 12,
    background: "transparent", border: "none", borderRadius: 9, padding: "10px 12px",
    cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "background .12s" },
  itemOn: { background: "#f0f6f1" },
  check: { width: 21, height: 21, borderRadius: 6, border: "2px solid #c3d3c7",
    display: "grid", placeItems: "center", flexShrink: 0, color: "#fff", transition: "all .15s" },
  checkOn: { background: "#3f8f5b", borderColor: "#3f8f5b" },
  itemName: { flex: 1, fontSize: 14, color: "#26332b" },
  itemNameOn: { color: "#9aa89e", textDecoration: "line-through" },
  useTag: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
    flexShrink: 0, minWidth: 30, textAlign: "center" },
  reqDot: { width: 9, height: 9, borderRadius: 99, background: "#d9822b", flexShrink: 0 },
  optDot: { width: 9, height: 9, borderRadius: 99, background: "#cdd6cf", flexShrink: 0 },

  empty: { textAlign: "center", padding: "60px 20px", color: "#8a9a8e",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  footer: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
    justifyContent: "center", padding: "18px 0 8px", fontSize: 12, color: "#7c8d81" },
};

const GLOBAL_CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  button:focus-visible, input:focus-visible { outline: 2px solid #3f8f5b; outline-offset: 2px; }
  @media (max-width: 560px) {
    .prog-hide { display:none; }
  }
`;
