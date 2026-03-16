import { useState, useMemo, useEffect } from "react";

// ============================================================
// PI DATA – verified against EVE University Wiki
// ============================================================

const TIER_COLORS = { p4: "#f59e0b", p3: "#818cf8", p2: "#34d399", p1: "#64748b" };

// TypeIDs from EVE Online – verified against user-provided TypeID_Name.xlsx
const TYPE_IDS = {
  // P4
  "Broadcast Node":             2867,
  "Integrity Response Drones":  2868,
  "Nano-Factory":               2869,
  "Organic Mortar Applicators": 2870,
  "Recursive Computing Module": 2871,
  "Self-Harmonizing Power Core":2872,
  "Sterile Conduits":           2875,
  "Wetware Mainframe":          2876,
  // P3
  "Biotech Research Reports":      2358,
  "Camera Drones":                 2345,
  "Condensates":                   2344,
  "Cryoprotectant Solution":       2367,
  "Data Chips":                    17392,
  "Gel-Matrix Biopaste":           2348,
  "Guidance Systems":              9834,
  "Hazmat Detection Systems":      2366,
  "Hermetic Membranes":            2361,
  "High-Tech Transmitters":        17898,
  "Industrial Explosives":         2360,
  "Neocoms":                       2354,
  "Nuclear Reactors":              2352,
  "Planetary Vehicles":            9846,
  "Robotics":                      9848,
  "Smartfab Units":                2351,
  "Supercomputers":                2349,
  "Synthetic Synapses":            2346,
  "Transcranial Microcontrollers": 12836,
  "Ukomi Superconductors":         17136,
  "Vaccines":                      28974,
  // P2
  "Biocells":                       2329,
  "Construction Blocks":            3828,
  "Consumer Electronics":           9836,
  "Coolant":                        9832,
  "Enriched Uranium":               44,
  "Fertilizer":                     3693,
  "Genetically Enhanced Livestock": 15317,
  "Livestock":                      3725,
  "Mechanical Parts":               3689,
  "Microfiber Shielding":           2327,
  "Miniature Electronics":          9842,
  "Nanites":                        2463,
  "Oxides":                         2317,
  "Polyaramids":                    2321,
  "Polytextiles":                   3695,
  "Rocket Fuel":                    9830,
  "Silicate Glass":                 3697,
  "Superconductors":                9838,
  "Supertensile Plastics":          2312,
  "Synthetic Oil":                  3691,
  "Test Cultures":                  2319,
  "Transmitter":                    9840,
  "Viral Agent":                    3775,
  "Water-Cooled CPU":               2328,
  // P1
  "Bacteria":          2393,
  "Biofuels":          2396,
  "Biomass":           3779,
  "Chiral Structures": 2401,
  "Electrolytes":      2390,
  "Industrial Fibers": 2397,
  "Oxygen":            3683,
  "Oxidizing Compound":2392,
  "Plasmoids":         2389,
  "Precious Metals":   2399,
  "Proteins":          2395,
  "Reactive Metals":   2398,
  "Silicon":           9828,
  "Toxic Metals":      2400,
  "Water":             3645,
};

const P2 = {
  "Biocells":                       ["Precious Metals",    "Biofuels"          ],
  "Construction Blocks":            ["Toxic Metals",       "Reactive Metals"   ],
  "Consumer Electronics":           ["Chiral Structures",  "Toxic Metals"      ],
  "Coolant":                        ["Water",              "Electrolytes"      ],
  "Enriched Uranium":               ["Toxic Metals",       "Precious Metals"   ],
  "Fertilizer":                     ["Proteins",           "Bacteria"          ],
  "Genetically Enhanced Livestock": ["Biomass",            "Proteins"          ],
  "Livestock":                      ["Biofuels",           "Proteins"          ],
  "Mechanical Parts":               ["Precious Metals",    "Reactive Metals"   ],
  "Microfiber Shielding":           ["Silicon",            "Industrial Fibers" ],
  "Miniature Electronics":          ["Silicon",            "Chiral Structures" ],
  "Nanites":                        ["Reactive Metals",    "Bacteria"          ],
  "Oxides":                         ["Oxygen",             "Oxidizing Compound"],
  "Polyaramids":                    ["Industrial Fibers",  "Oxidizing Compound"],
  "Polytextiles":                   ["Industrial Fibers",  "Biofuels"          ],
  "Rocket Fuel":                    ["Electrolytes",       "Plasmoids"         ],
  "Silicate Glass":                 ["Silicon",            "Oxidizing Compound"],
  "Superconductors":                ["Water",              "Plasmoids"         ],
  "Supertensile Plastics":          ["Biomass",            "Oxygen"            ],
  "Synthetic Oil":                  ["Oxygen",             "Electrolytes"      ],
  "Test Cultures":                  ["Water",              "Bacteria"          ],
  "Transmitter":                    ["Chiral Structures",  "Plasmoids"         ],
  "Viral Agent":                    ["Biomass",            "Bacteria"          ],
  "Water-Cooled CPU":               ["Reactive Metals",    "Water"             ],
};
const P2_PER_UNIT = 8;

const P3 = {
  "Biotech Research Reports":      { i: ["Nanites",              "Livestock",           "Construction Blocks"   ] },
  "Camera Drones":                 { i: ["Silicate Glass",       "Rocket Fuel"                                  ] },
  "Condensates":                   { i: ["Oxides",               "Coolant"                                      ] },
  "Cryoprotectant Solution":       { i: ["Test Cultures",        "Synthetic Oil",        "Fertilizer"           ] },
  "Data Chips":                    { i: ["Supertensile Plastics", "Microfiber Shielding"                         ] },
  "Gel-Matrix Biopaste":           { i: ["Oxides",               "Biocells",             "Superconductors"      ] },
  "Guidance Systems":              { i: ["Water-Cooled CPU",     "Transmitter"                                  ] },
  "Hazmat Detection Systems":      { i: ["Polytextiles",         "Viral Agent",          "Transmitter"          ] },
  "Hermetic Membranes":            { i: ["Polyaramids",          "Genetically Enhanced Livestock"               ] },
  "High-Tech Transmitters":        { i: ["Polyaramids",          "Transmitter"                                  ] },
  "Industrial Explosives":         { i: ["Fertilizer",           "Polytextiles"                                 ] },
  "Neocoms":                       { i: ["Biocells",             "Silicate Glass"                               ] },
  "Nuclear Reactors":              { i: ["Microfiber Shielding", "Enriched Uranium"                             ] },
  "Planetary Vehicles":            { i: ["Supertensile Plastics","Mechanical Parts",     "Miniature Electronics"] },
  "Robotics":                      { i: ["Mechanical Parts",     "Consumer Electronics"                         ] },
  "Smartfab Units":                { i: ["Construction Blocks",  "Miniature Electronics"                        ] },
  "Supercomputers":                { i: ["Water-Cooled CPU",     "Coolant",              "Consumer Electronics" ] },
  "Synthetic Synapses":            { i: ["Supertensile Plastics","Test Cultures"                                ] },
  "Transcranial Microcontrollers": { i: ["Biocells",             "Nanites"                                      ] },
  "Ukomi Superconductors":         { i: ["Synthetic Oil",        "Superconductors"                              ] },
  "Vaccines":                      { i: ["Livestock",            "Viral Agent"                                  ] },
};
const P3_PER_UNIT = 10 / 3;

const P4 = {
  "Broadcast Node":             { i: ["Data Chips",              "High-Tech Transmitters", "Neocoms"                       ], t:["p3","p3","p3"], q:[6,6,6]  },
  "Integrity Response Drones":  { i: ["Gel-Matrix Biopaste",     "Hazmat Detection Systems","Planetary Vehicles"            ], t:["p3","p3","p3"], q:[6,6,6]  },
  "Nano-Factory":               { i: ["Industrial Explosives",   "Reactive Metals",         "Ukomi Superconductors"         ], t:["p3","p1","p3"], q:[6,40,6] },
  "Organic Mortar Applicators": { i: ["Condensates",             "Bacteria",                "Robotics"                     ], t:["p3","p1","p3"], q:[6,40,6] },
  "Recursive Computing Module": { i: ["Guidance Systems",        "Synthetic Synapses",      "Transcranial Microcontrollers" ], t:["p3","p3","p3"], q:[6,6,6]  },
  "Self-Harmonizing Power Core":{ i: ["Camera Drones",           "Hermetic Membranes",      "Nuclear Reactors"              ], t:["p3","p3","p3"], q:[6,6,6]  },
  "Sterile Conduits":           { i: ["Smartfab Units",          "Vaccines",                "Water"                        ], t:["p3","p3","p1"], q:[6,6,40] },
  "Wetware Mainframe":          { i: ["Biotech Research Reports","Cryoprotectant Solution",  "Supercomputers"               ], t:["p3","p3","p3"], q:[6,6,6]  },
};

// All known item names for fuzzy stock matching
const ALL_ITEMS = [
  ...Object.keys(P4),
  ...Object.keys(P3),
  ...Object.keys(P2),
  "Bacteria","Biofuels","Biomass","Chiral Structures","Electrolytes",
  "Industrial Fibers","Noble Gas","Noble Metals","Oxidizing Compound",
  "Oxygen","Plasmoids","Precious Metals","Proteins","Reactive Metals",
  "Silicon","Toxic Metals","Water",
];

// ============================================================
// STOCK PARSER
// Accepts lines like:
//   "Toxic Metals 123000"
//   "toxic metals   123,000"
//   "123000 Toxic Metals"
// Returns { "Toxic Metals": 123000, ... }
// ============================================================

function parseStock(text) {
  const result = {};
  if (!text.trim()) return result;

  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);

  lines.forEach(line => {
    // Remove commas/dots used as thousand separators
    const clean = line.replace(/,/g, "");
    // Extract all numbers from line
    const nums = clean.match(/\d+/g);
    if (!nums) return;
    const qty = parseInt(nums[nums.length - 1]);
    if (!qty || qty <= 0) return;

    // Remove the number from the line to get the item name candidate
    const nameCandidate = clean.replace(/\d+/g, "").trim().toLowerCase();

    // Find best match among known items (case-insensitive)
    const match = ALL_ITEMS.find(item =>
      item.toLowerCase() === nameCandidate
    ) || ALL_ITEMS.find(item =>
      nameCandidate.includes(item.toLowerCase()) ||
      item.toLowerCase().includes(nameCandidate)
    );

    if (match) {
      result[match] = (result[match] || 0) + qty;
    }
  });

  return result;
}

// ============================================================
// CALCULATION ENGINE
// Stock is propagated through the chain:
//   P3 stock → reduces P2 demand
//   P2 stock → reduces P1 demand
//   P1 stock → reduces P1 demand
// The "gross" values reflect total demand before stock.
// The "net" values reflect demand after subtracting stock at each tier.
// ============================================================

function calculateMulti({ p4q, p3q, p2q, stock }) {
  // --- Gross needs (ignoring stock) ---
  const p3Gross = {}, p2Gross = {}, p1Gross = {};
  const addP3 = (n, v) => { p3Gross[n] = (p3Gross[n]||0) + v; };
  const addP2 = (n, v) => { p2Gross[n] = (p2Gross[n]||0) + v; };
  const addP1 = (n, v) => { p1Gross[n] = (p1Gross[n]||0) + v; };

  // P4 → P3 / P1
  Object.entries(p4q).forEach(([name, want]) => {
    if (!want || want <= 0) return;
    const r = P4[name]; if (!r) return;
    r.i.forEach((item, idx) => {
      const qty = r.q[idx] * want;
      if (r.t[idx] === "p3") addP3(item, qty);
      else addP1(item, qty);
    });
  });

  // P3 direct inputs
  Object.entries(p3q).forEach(([name, want]) => {
    if (!want || want <= 0) return;
    addP3(name, want);
  });

  // P3 gross → P2 gross (full, before stock)
  Object.entries(p3Gross).forEach(([name, qty]) => {
    const r = P3[name]; if (!r) return;
    r.i.forEach(p2Name => addP2(p2Name, qty * P3_PER_UNIT));
  });

  // P2 direct inputs
  Object.entries(p2q).forEach(([name, want]) => {
    if (!want || want <= 0) return;
    addP2(name, want);
  });

  // P2 gross → P1 gross (full, before stock)
  Object.entries(p2Gross).forEach(([name, qty]) => {
    const inputs = P2[name]; if (!inputs) return;
    inputs.forEach(p1Name => addP1(p1Name, qty * P2_PER_UNIT));
  });

  // Ceil gross values
  Object.keys(p3Gross).forEach(k => { p3Gross[k] = Math.ceil(p3Gross[k]); });
  Object.keys(p2Gross).forEach(k => { p2Gross[k] = Math.ceil(p2Gross[k]); });
  Object.keys(p1Gross).forEach(k => { p1Gross[k] = Math.ceil(p1Gross[k]); });

  // --- Net needs (stock propagated through chain) ---
  const p3Net = {}, p2Net = {}, p1Net = {};

  // P3 net = gross minus P3 stock
  Object.entries(p3Gross).forEach(([n, gross]) => {
    p3Net[n] = Math.max(0, gross - (stock[n] || 0));
  });

  // P2 net = gross from P3-net only, minus P2 stock
  const p2FromP3Net = {};
  Object.entries(p3Net).forEach(([name, qty]) => {
    const r = P3[name]; if (!r) return;
    r.i.forEach(p2Name => {
      p2FromP3Net[p2Name] = (p2FromP3Net[p2Name] || 0) + qty * P3_PER_UNIT;
    });
  });
  // Add P2 direct inputs to p2FromP3Net
  Object.entries(p2q).forEach(([name, want]) => {
    if (!want || want <= 0) return;
    p2FromP3Net[name] = (p2FromP3Net[name] || 0) + want;
  });
  Object.entries(p2FromP3Net).forEach(([n, v]) => {
    const grossVal = Math.ceil(v);
    p2Net[n] = Math.max(0, grossVal - (stock[n] || 0));
  });

  // P1 net = from P2-net only, minus P1 stock
  const p1FromP2Net = {};
  Object.entries(p2Net).forEach(([name, qty]) => {
    const inputs = P2[name]; if (!inputs) return;
    inputs.forEach(p1Name => {
      p1FromP2Net[p1Name] = (p1FromP2Net[p1Name] || 0) + qty * P2_PER_UNIT;
    });
  });
  // Add P1 direct from P4 (already in p1Gross for items not going through P2)
  // These are the P1 items directly required by P4 (e.g. Reactive Metals, Bacteria)
  Object.entries(p1Gross).forEach(([n, v]) => {
    // Only add if it came from P4 directly (not from P2 expansion)
    // We detect this: if it's NOT an output of any P2 recipe, it came from P4 directly
    const isP2Output = Object.values(P2).some(inputs => inputs.includes(n));
    if (!isP2Output) {
      p1FromP2Net[n] = (p1FromP2Net[n] || 0) + v;
    }
  });
  Object.entries(p1FromP2Net).forEach(([n, v]) => {
    p1Net[n] = Math.max(0, Math.ceil(v) - (stock[n] || 0));
  });

  return {
    p3Gross, p2Gross, p1Gross,
    p3Net,   p2Net,   p1Net,
  };
}

// ============================================================
// UI HELPERS
// ============================================================

const fmt = n => n.toLocaleString("en-US");

function Badge({ tier }) {
  return (
    <span style={{
      background: TIER_COLORS[tier], color: "#060c1a",
      fontSize: "0.6rem", fontWeight: 800, padding: "1px 5px",
      borderRadius: 3, marginRight: 6, letterSpacing: "0.06em", flexShrink: 0,
    }}>{tier.toUpperCase()}</span>
  );
}

// Collapsible input section
function InputSection({ tier, label, items, quantities, onChange, onClear }) {
  const [open, setOpen] = useState(true);
  const activeCount = Object.values(quantities).filter(v => v > 0).length;
  const color = TIER_COLORS[tier];
  return (
    <div style={{ border: `1px solid ${color}30`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
      <div onClick={() => setOpen(o => !o)} style={{
        background: `${color}10`, padding: "10px 18px",
        borderBottom: open ? `1px solid ${color}20` : "none",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", userSelect: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: color, color: "#060c1a", fontSize: "0.62rem", fontWeight: 800, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.08em" }}>{tier.toUpperCase()}</span>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color, letterSpacing: "0.15em" }}>{label}</span>
          {activeCount > 0 && (
            <span style={{ background: `${color}22`, color, fontSize: "0.62rem", fontWeight: 700, padding: "1px 8px", borderRadius: 10 }}>
              {activeCount} active
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {activeCount > 0 && (
            <button onClick={e => { e.stopPropagation(); onClear(); }} style={{
              background: "transparent", border: `1px solid ${color}30`, color: "#475569",
              fontSize: "0.6rem", padding: "2px 8px", borderRadius: 4, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.08em",
            }}>CLEAR</button>
          )}
          <span style={{ color, fontSize: "0.9rem" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}>
          {items.map(name => {
            const active = (quantities[name] || 0) > 0;
            return (
              <div key={name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 16px", borderBottom: "1px solid #0a1428", borderRight: "1px solid #0a1428",
                background: active ? `${color}08` : "transparent", transition: "background 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: active ? color : "#1e3a5f", transition: "background 0.15s" }} />
                  <span style={{ fontSize: "0.8rem", color: active ? color : "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "color 0.15s" }}>{name}</span>
                </div>
                <input type="number" min={0}
                  value={quantities[name] > 0 ? quantities[name] : ""}
                  placeholder="0"
                  onChange={e => onChange(name, Math.max(0, parseInt(e.target.value) || 0))}
                  style={{
                    background: active ? "#0f1e36" : "#060c1a", color: active ? color : "#334155",
                    border: `1px solid ${active ? color + "50" : "#0f1e36"}`,
                    borderRadius: 5, padding: "4px 8px", fontSize: "0.84rem", fontFamily: "inherit",
                    width: 68, textAlign: "right", outline: "none", transition: "all 0.15s", flexShrink: 0, marginLeft: 10,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Stock import panel
function StockPanel({ onApply }) {
  const [open, setOpen] = useState(true);
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState({});
  const [applied, setApplied] = useState(false);

  const handleParse = () => {
    const result = parseStock(text);
    setParsed(result);
    setApplied(false);
  };

  const handleApply = () => {
    // Normalize keys to lowercase for reliable matching
    const normalized = {};
    Object.entries(parsed).forEach(([k, v]) => { normalized[k] = v; });
    onApply(normalized);
    setApplied(true);
  };

  const handleClear = () => {
    setText("");
    setParsed({});
    onApply({});
    setApplied(false);
  };

  const parsedCount = Object.keys(parsed).length;

  return (
    <div style={{ border: "1px solid #2d4a7a", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
      <div onClick={() => setOpen(o => !o)} style={{
        background: "#0a1428", padding: "10px 18px",
        borderBottom: open ? "1px solid #1e3a5f" : "none",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", userSelect: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: "#2d4a7a", color: "#93c5fd", fontSize: "0.62rem", fontWeight: 800, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.08em" }}>STOCK</span>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#93c5fd", letterSpacing: "0.15em" }}>INVENTORY IMPORT</span>
          {parsedCount > 0 && applied && (
            <span style={{ background: "#1e3a5f", color: "#93c5fd", fontSize: "0.62rem", fontWeight: 700, padding: "1px 8px", borderRadius: 10 }}>
              {parsedCount} items loaded
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {(text || parsedCount > 0) && (
            <button onClick={e => { e.stopPropagation(); handleClear(); }} style={{
              background: "transparent", border: "1px solid #1e3a5f", color: "#475569",
              fontSize: "0.6rem", padding: "2px 8px", borderRadius: 4, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.08em",
            }}>CLEAR</button>
          )}
          <span style={{ color: "#93c5fd", fontSize: "0.9rem" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: "14px 18px", background: "#060c1a" }}>
          <div style={{ fontSize: "0.62rem", color: "#475569", marginBottom: 8, letterSpacing: "0.08em" }}>
            PASTE YOUR INVENTORY — one item per line, e.g. &nbsp;
            <span style={{ color: "#93c5fd" }}>Toxic Metals 123000</span>
          </div>
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setApplied(false); }}
            placeholder={"Toxic Metals 123000\nReactive Metals 50000\nCoolant 8000\n..."}
            style={{
              width: "100%", minHeight: 120, background: "#0a1428",
              color: "#cbd5e1", border: "1px solid #1e3a5f", borderRadius: 8,
              padding: "10px 12px", fontSize: "0.8rem", fontFamily: "inherit",
              resize: "vertical", outline: "none", boxSizing: "border-box",
              lineHeight: 1.6,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <button onClick={handleParse} style={{
              background: "#1e3a5f", color: "#93c5fd", border: "1px solid #2d4a7a",
              borderRadius: 6, padding: "6px 16px", fontSize: "0.72rem", fontFamily: "inherit",
              cursor: "pointer", letterSpacing: "0.1em", fontWeight: 700,
            }}>PARSE</button>
            {parsedCount > 0 && !applied && (
              <button onClick={handleApply} style={{
                background: "#0f3020", color: "#34d399", border: "1px solid #34d39950",
                borderRadius: 6, padding: "6px 16px", fontSize: "0.72rem", fontFamily: "inherit",
                cursor: "pointer", letterSpacing: "0.1em", fontWeight: 700,
              }}>APPLY TO CALCULATOR ({parsedCount} items)</button>
            )}
            {parsedCount > 0 && applied && (
              <span style={{ fontSize: "0.7rem", color: "#34d399" }}>✓ {parsedCount} items applied to stock</span>
            )}
            {parsedCount === 0 && text.trim() && (
              <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>No recognizable items found</span>
            )}
          </div>

          {/* Preview of parsed items */}
          {parsedCount > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "5px 8px" }}>
              {Object.entries(parsed).map(([n, v]) => (
                <div key={n} style={{
                  background: "#0a1e30", border: "1px solid #2d4a7a", borderRadius: 6,
                  padding: "3px 10px", fontSize: "0.72rem", display: "flex", gap: 7, alignItems: "center",
                }}>
                  <span style={{ color: "#64748b" }}>{n}</span>
                  <span style={{ color: "#93c5fd", fontWeight: 700 }}>{fmt(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const fmtISK = v => {
  if (!v || v === 0) return "—";
  if (v >= 1e9) return (v / 1e9).toFixed(2) + " B";
  if (v >= 1e6) return (v / 1e6).toFixed(2) + " M";
  if (v >= 1e3) return (v / 1e3).toFixed(1) + " K";
  return Math.round(v).toLocaleString("en-US");
};

const GRID = "1fr 80px 80px 80px 100px 120px";

// 6-column result row: Name | Gross | Stock | Net | Unit Price | Net Value
function ResultRow3({ name, tier, gross, stockVal, net, getPrice }) {
  const color = TIER_COLORS[tier];
  const covered = net === 0 && stockVal > 0;
  const typeId = TYPE_IDS[name];
  const unitPrice = getPrice ? getPrice(name) : 0;
  const netValue = unitPrice > 0 ? net * unitPrice : 0;

  return (
    <div style={{
      display: "grid", gridTemplateColumns: GRID,
      alignItems: "center", padding: "5px 18px",
      borderBottom: "1px solid #0a1428",
      background: covered ? "#061810" : "transparent",
    }}>
      <span style={{ fontSize: "0.78rem", color: covered ? "#34d39970" : "#cbd5e1", display: "flex", alignItems: "center", gap: 5 }}>
        <Badge tier={tier} />
        {typeId ? (
          <a href={`https://evemarketer.com/types/${typeId}`} target="_blank" rel="noopener noreferrer"
            style={{ color: covered ? "#34d39970" : color, textDecoration: "none" }}
            title={`TypeID: ${typeId} — EVE Marketer`}
          >{name}</a>
        ) : name}
        {typeId && <span style={{ fontSize: "0.52rem", color: "#1e3a5f" }}>#{typeId}</span>}
        {covered && <span style={{ fontSize: "0.56rem", color: "#34d399" }}>✓</span>}
      </span>
      <span style={{ textAlign: "right", fontSize: "0.78rem", fontWeight: 700, color, paddingRight: 6 }}>{fmt(gross)}</span>
      <span style={{ textAlign: "right", fontSize: "0.78rem", fontWeight: 700, color: stockVal > 0 ? "#93c5fd" : "#1e3a5f", paddingRight: 6 }}>
        {stockVal > 0 ? fmt(stockVal) : "—"}
      </span>
      <span style={{ textAlign: "right", fontSize: "0.78rem", fontWeight: 700,
        color: net === 0 ? "#34d399" : net < gross * 0.5 ? "#fbbf24" : "#f87171", paddingRight: 6 }}>
        {net === 0 ? "✓ 0" : fmt(net)}
      </span>
      <span style={{ textAlign: "right", fontSize: "0.73rem", color: unitPrice > 0 ? "#e2e8f0" : "#1e3a5f", paddingRight: 6 }}>
        {fmtISK(unitPrice)}
      </span>
      <span style={{ textAlign: "right", fontSize: "0.73rem", fontWeight: 700,
        color: netValue > 0 ? "#f59e0b" : "#1e3a5f", paddingRight: 4 }}>
        {fmtISK(netValue)}
      </span>
    </div>
  );
}

// Column headers row
function ColHeaders({ tier }) {
  const color = TIER_COLORS[tier];
  const headers = [
    { label: "Gross",      color },
    { label: "Stock",      color: "#93c5fd" },
    { label: "Net",        color: "#64748b" },
    { label: "Unit Price", color: "#94a3b8" },
    { label: "Net Value",  color: "#f59e0b" },
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: GRID,
      padding: "4px 18px", borderBottom: `1px solid ${color}20`, background: "#080f1c",
    }}>
      <span />
      {headers.map(h => (
        <span key={h.label} style={{
          textAlign: "right", fontSize: "0.56rem", fontWeight: 700,
          color: h.color, letterSpacing: "0.1em", textTransform: "uppercase",
          paddingRight: h.label === "Net Value" ? 4 : 6,
        }}>{h.label}</span>
      ))}
    </div>
  );
}

// Full collapsible result section with price columns
function ResultSection({ tier, label, gross, net, stock, getPrice }) {
  const [open, setOpen] = useState(true);
  const color = TIER_COLORS[tier];
  const entries = Object.entries(gross).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return <></>;

  const totalNetValue = entries.reduce((s, [n, g]) => {
    const nv = net[n] !== undefined ? net[n] : Math.max(0, g - (stock[n]||0));
    const p = getPrice ? getPrice(n) : 0;
    return s + nv * p;
  }, 0);

  return (
    <div style={{ background: "#0d1526", border: `1px solid ${color}28`, borderRadius: 12, overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        background: `${color}10`, padding: "9px 18px",
        borderBottom: open ? `1px solid ${color}20` : "none",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", userSelect: "none",
      }}>
        <span style={{ fontSize: "0.66rem", letterSpacing: "0.18em", color, fontWeight: 700, textTransform: "uppercase" }}>
          {label} <span style={{ opacity: 0.5, fontWeight: 400 }}>· {entries.length} items</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {totalNetValue > 0 && <span style={{ fontSize: "0.68rem", color: "#f59e0b", fontWeight: 700 }}>{fmtISK(totalNetValue)} ISK</span>}
          <span style={{ color, fontSize: "0.85rem" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <>
          <ColHeaders tier={tier} />
          {entries.map(([n, g]) => (
            <ResultRow3 key={n} name={n} tier={tier}
              gross={g} stockVal={stock[n] || 0}
              net={net[n] !== undefined ? net[n] : Math.max(0, g - (stock[n]||0))}
              getPrice={getPrice}
            />
          ))}
        </>
      )}
    </div>
  );
}

// P1 result section with price columns
function P1ResultSection({ grossData, netData, stock, getPrice }) {
  const [open, setOpen] = useState(true);
  const color = TIER_COLORS.p1;
  const entries = Object.entries(grossData).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const totalNet = entries.reduce((s, [n, v]) => s + (netData[n] !== undefined ? netData[n] : Math.max(0, v - (stock[n]||0))), 0);
  const totalNetValue = entries.reduce((s, [n, g]) => {
    const nv = netData[n] !== undefined ? netData[n] : Math.max(0, g - (stock[n]||0));
    const p = getPrice ? getPrice(n) : 0;
    return s + nv * p;
  }, 0);

  return (
    <div style={{ background: "#0d1526", border: `1px solid ${color}28`, borderRadius: 12, overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        background: `${color}10`, padding: "9px 18px",
        borderBottom: open ? `1px solid ${color}20` : "none",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", userSelect: "none",
      }}>
        <span style={{ fontSize: "0.66rem", letterSpacing: "0.18em", color, fontWeight: 700, textTransform: "uppercase" }}>
          P1 — Processed Materials Required <span style={{ opacity: 0.5, fontWeight: 400 }}>· {entries.length} materials</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {totalNetValue > 0 && <span style={{ fontSize: "0.68rem", color: "#f59e0b", fontWeight: 700 }}>{fmtISK(totalNetValue)} ISK</span>}
          <span style={{ color, fontSize: "0.85rem" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <>
          <ColHeaders tier="p1" />
          {entries.map(([n, g]) => (
            <ResultRow3 key={n} name={n} tier="p1"
              gross={g} stockVal={stock[n] || 0}
              net={netData[n] !== undefined ? netData[n] : Math.max(0, g - (stock[n]||0))}
              getPrice={getPrice}
            />
          ))}
          <div style={{
            display: "grid", gridTemplateColumns: GRID,
            padding: "7px 18px", background: "#060c1a", borderTop: "1px solid #1e3a5f",
          }}>
            <span style={{ fontSize: "0.7rem", color: "#475569" }}>Total P1:</span>
            <span style={{ textAlign: "right", fontSize: "0.75rem", fontWeight: 700, color, paddingRight: 6 }}>{fmt(total)}</span>
            <span style={{ textAlign: "right", fontSize: "0.75rem", color: "#1e3a5f", paddingRight: 6 }}>—</span>
            <span style={{ textAlign: "right", fontSize: "0.75rem", fontWeight: 700, color: "#f87171", paddingRight: 6 }}>{fmt(totalNet)}</span>
            <span style={{ textAlign: "right", fontSize: "0.75rem", color: "#1e3a5f", paddingRight: 6 }}>—</span>
            <span style={{ textAlign: "right", fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b", paddingRight: 4 }}>
              {totalNetValue > 0 ? fmtISK(totalNetValue) + " ISK" : "—"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function NetOverview({ p1Gross, p1Net }) {
  const [copied, setCopied] = useState(false);

  const entries = Object.entries(p1Gross).sort((a, b) => b[1] - a[1]);
  const netEntries = entries.map(([n, g]) => [n, p1Net[n] !== undefined ? p1Net[n] : g]);
  const needed = netEntries.filter(([, net]) => net > 0);

  const handleCopy = () => {
    const text = needed.map(([n, net]) => `${n}\t${net}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ background: "#0a0f1e", border: "1px solid #1e3a5f", borderRadius: 12, padding: "12px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: "0.6rem", color: "#334155", letterSpacing: "0.18em" }}>
          P1 NET REQUIREMENTS OVERVIEW
        </div>
        {needed.length > 0 && (
          <button
            onClick={handleCopy}
            style={{
              background: copied ? "#061810" : "#0a1428",
              border: `1px solid ${copied ? "#34d39950" : "#1e3a5f"}`,
              color: copied ? "#34d399" : "#93c5fd",
              fontSize: "0.62rem", fontWeight: 700, padding: "4px 12px",
              borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
              letterSpacing: "0.1em", transition: "all 0.2s",
            }}
          >
            {copied ? "✓ COPIED" : "⎘ COPY NET"}
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 8px" }}>
        {netEntries.map(([n, net]) => (
          <div key={n} style={{
            background: net === 0 ? "#061810" : "#111827",
            borderRadius: 6, padding: "3px 10px",
            fontSize: "0.72rem", display: "flex", gap: 7, alignItems: "center",
            border: `1px solid ${net === 0 ? "#34d39940" : "#1a2d45"}`,
          }}>
            <span style={{ color: net === 0 ? "#34d39970" : "#475569" }}>{n}</span>
            <span style={{ color: net === 0 ? "#34d399" : "#94a3b8", fontWeight: 700 }}>
              {net === 0 ? "✓" : fmt(net)}
            </span>
          </div>
        ))}
      </div>
      {needed.length === 0 && entries.length > 0 && (
        <div style={{ fontSize: "0.75rem", color: "#34d399", marginTop: 6 }}>
          ✓ All P1 materials are covered by your stock!
        </div>
      )}
    </div>
  );
}

// Demand import panel – parses a list and fills the input fields
function DemandPanel({ onApply }) {
  const [open, setOpen] = useState(true);
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState({ p4:{}, p3:{}, p2:{} });
  const [applied, setApplied] = useState(false);

  const handleParse = () => {
    const raw = parseStock(text); // reuse same parser
    const p4 = {}, p3 = {}, p2 = {};
    Object.entries(raw).forEach(([name, qty]) => {
      if (P4[name])      p4[name] = qty;
      else if (P3[name]) p3[name] = qty;
      else if (P2[name]) p2[name] = qty;
    });
    setParsed({ p4, p3, p2 });
    setApplied(false);
  };

  const handleApply = () => {
    onApply(parsed);
    setApplied(true);
  };

  const handleClear = () => {
    setText("");
    setParsed({ p4:{}, p3:{}, p2:{} });
    onApply({ p4:{}, p3:{}, p2:{} });
    setApplied(false);
  };

  const totalCount = Object.values(parsed).reduce((s, o) => s + Object.keys(o).length, 0);

  return (
    <div style={{ border: "1px solid #f59e0b40", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
      <div onClick={() => setOpen(o => !o)} style={{
        background: "#f59e0b0a", padding: "10px 18px",
        borderBottom: open ? "1px solid #f59e0b20" : "none",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", userSelect: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: "#f59e0b", color: "#060c1a", fontSize: "0.62rem", fontWeight: 800, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.08em" }}>DEMAND</span>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f59e0b", letterSpacing: "0.15em" }}>IMPORT — paste a list to fill all tiers at once</span>
          {totalCount > 0 && applied && (
            <span style={{ background: "#f59e0b20", color: "#f59e0b", fontSize: "0.62rem", fontWeight: 700, padding: "1px 8px", borderRadius: 10 }}>
              {totalCount} items loaded
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {(text || totalCount > 0) && (
            <button onClick={e => { e.stopPropagation(); handleClear(); }} style={{
              background: "transparent", border: "1px solid #f59e0b30", color: "#475569",
              fontSize: "0.6rem", padding: "2px 8px", borderRadius: 4, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.08em",
            }}>CLEAR</button>
          )}
          <span style={{ color: "#f59e0b", fontSize: "0.9rem" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: "14px 18px", background: "#060c1a" }}>
          <div style={{ fontSize: "0.62rem", color: "#475569", marginBottom: 8, letterSpacing: "0.08em" }}>
            PASTE YOUR DEMAND — one item per line, items are automatically sorted into the correct tier&nbsp;
            <span style={{ color: "#f59e0b" }}>Wetware Mainframe 500</span>
          </div>
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setApplied(false); }}
            placeholder={"Wetware Mainframe 500\nNano-Factory 200\nCoolant 5000\n..."}
            style={{
              width: "100%", minHeight: 110, background: "#0a1020",
              color: "#cbd5e1", border: "1px solid #f59e0b30", borderRadius: 8,
              padding: "10px 12px", fontSize: "0.8rem", fontFamily: "inherit",
              resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <button onClick={handleParse} style={{
              background: "#1a1000", color: "#f59e0b", border: "1px solid #f59e0b50",
              borderRadius: 6, padding: "6px 16px", fontSize: "0.72rem", fontFamily: "inherit",
              cursor: "pointer", letterSpacing: "0.1em", fontWeight: 700,
            }}>PARSE</button>
            {totalCount > 0 && !applied && (
              <button onClick={handleApply} style={{
                background: "#0f1e10", color: "#34d399", border: "1px solid #34d39950",
                borderRadius: 6, padding: "6px 16px", fontSize: "0.72rem", fontFamily: "inherit",
                cursor: "pointer", letterSpacing: "0.1em", fontWeight: 700,
              }}>APPLY TO CALCULATOR ({totalCount} items)</button>
            )}
            {totalCount > 0 && applied && (
              <span style={{ fontSize: "0.7rem", color: "#34d399" }}>✓ {totalCount} items applied</span>
            )}
            {totalCount === 0 && text.trim() && (
              <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>No recognizable items found</span>
            )}
          </div>

          {/* Preview sorted by tier */}
          {totalCount > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {[["p4", parsed.p4, TIER_COLORS.p4], ["p3", parsed.p3, TIER_COLORS.p3], ["p2", parsed.p2, TIER_COLORS.p2]].map(([tier, obj, color]) =>
                Object.keys(obj).length > 0 && (
                  <div key={tier} style={{ display: "flex", flexWrap: "wrap", gap: "4px 6px", alignItems: "center" }}>
                    <span style={{ background: color, color: "#060c1a", fontSize: "0.58rem", fontWeight: 800, padding: "1px 5px", borderRadius: 3, letterSpacing: "0.06em", flexShrink: 0 }}>{tier.toUpperCase()}</span>
                    {Object.entries(obj).map(([n, v]) => (
                      <div key={n} style={{
                        background: `${color}12`, border: `1px solid ${color}30`,
                        borderRadius: 6, padding: "2px 9px", fontSize: "0.7rem",
                        display: "flex", gap: 6, alignItems: "center",
                      }}>
                        <span style={{ color: "#64748b" }}>{n}</span>
                        <span style={{ color, fontWeight: 700 }}>{fmt(v)}</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

const emptyQty = items => Object.fromEntries(items.map(k => [k, 0]));

export default function PICalculator() {
  const [p4q, setP4q] = useState(emptyQty(Object.keys(P4)));
  const [p3q, setP3q] = useState(emptyQty(Object.keys(P3)));
  const [p2q, setP2q] = useState(emptyQty(Object.keys(P2)));
  const [stock, setStock] = useState({});
  const [visitCount, setVisitCount] = useState(null);
  const [prices, setPrices] = useState({});       // { typeId: { sell, buy } }
  const [priceStatus, setPriceStatus] = useState("idle"); // idle | loading | ok | error

  // ── Visit counter ──
  useEffect(() => {
    (async () => {
      try {
        let current = 0;
        try { const r = await window.storage.get("pi_visit_count", true); current = parseInt(r.value) || 0; } catch (_) {}
        const next = current + 1;
        await window.storage.set("pi_visit_count", String(next), true);
        setVisitCount(next);
      } catch (_) { setVisitCount(null); }
    })();
  }, []);

  // ── Price fetch – calls Goonmetrics directly ──
  // On Vercel: replace the URL with "/api/prices" to use the serverless proxy
  const fetchPrices = async () => {
    setPriceStatus("loading");
    try {
      const allIds = Object.values(TYPE_IDS).join(",");
      const url = `https://goonmetrics.apps.gnf.lt/api/price_data/?station_id=60003760&type_id=${allIds}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const xmlText = await resp.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, "text/xml");
      const types = doc.querySelectorAll("type");
      const map = {};
      types.forEach(typeEl => {
        const id = parseInt(typeEl.getAttribute("id"));
        if (!id) return;
        const sellMin = parseFloat(typeEl.querySelector("sell > min")?.textContent || "0") || 0;
        const buyMax  = parseFloat(typeEl.querySelector("buy > max")?.textContent  || "0") || 0;
        map[id] = { sell: sellMin, buy: buyMax };
      });
      if (Object.keys(map).length === 0) throw new Error("No price data in response");
      setPrices(map);
      setPriceStatus("ok");
    } catch (e) {
      console.error("Price fetch failed:", e);
      setPriceStatus("error");
    }
  };

  // No auto-fetch – prices loaded on button press only

  // helper: get sell price by item name
  const getPrice = name => {
    const id = TYPE_IDS[name];
    if (!id) return 0;
    return prices[id]?.sell || 0;
  };

  const setOne = setter => (name, val) => setter(prev => ({ ...prev, [name]: val }));
  const clearTier = (setter, items) => () => setter(emptyQty(items));

  const applyDemand = ({ p4, p3, p2 }) => {
    if (Object.keys(p4).length) setP4q(prev => ({ ...prev, ...p4 }));
    if (Object.keys(p3).length) setP3q(prev => ({ ...prev, ...p3 }));
    if (Object.keys(p2).length) setP2q(prev => ({ ...prev, ...p2 }));
  };

  const hasAny = useMemo(() =>
    [...Object.values(p4q), ...Object.values(p3q), ...Object.values(p2q)].some(v => v > 0),
    [p4q, p3q, p2q]
  );

  const res = useMemo(() =>
    hasAny ? calculateMulti({ p4q, p3q, p2q, stock }) : null,
    [p4q, p3q, p2q, stock, hasAny]
  );

  const activeP4 = Object.entries(p4q).filter(([, v]) => v > 0);
  const activeP3direct = Object.entries(p3q).filter(([, v]) => v > 0);
  const activeP2direct = Object.entries(p2q).filter(([, v]) => v > 0);

  return (
    <div style={{
      minHeight: "100vh", background: "#060c1a", color: "#e2e8f0",
      fontFamily: "'Courier New', Courier, monospace", padding: "24px 16px 56px",
    }}>
      {/* ── HEADER ── */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.38em", color: "#1e3a5f", marginBottom: 6 }}>
          EVE ONLINE ── PLANETARY INTERACTION
        </div>
        <h1 style={{
          fontSize: "clamp(1.1rem,4vw,1.7rem)", fontWeight: 900, margin: 0,
          background: "linear-gradient(100deg,#f59e0b 0%,#818cf8 55%,#34d399 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "0.05em",
        }}>
          MULTI-TIER PRODUCTION CHAIN CALCULATOR{" "}
          <span style={{ fontSize: "clamp(0.6rem,2vw,0.85rem)", fontWeight: 500, WebkitTextFillColor: "#ffffff", background: "none" }}>
            by Xel'matZe
          </span>
        </h1>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 20, padding: "4px 14px",
          }}>
            <span style={{ fontSize: "0.55rem", color: "#334155", letterSpacing: "0.15em" }}>TOTAL VISITS</span>
            <span style={{
              fontSize: "0.85rem", fontWeight: 800,
              background: "linear-gradient(90deg,#f59e0b,#818cf8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {visitCount === null ? "···" : visitCount.toLocaleString("en-US")}
            </span>
          </div>

          {/* Price fetch button */}
          <button onClick={fetchPrices} disabled={priceStatus === "loading"} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: priceStatus === "ok" ? "#061810" : priceStatus === "error" ? "#1a0808" : "#0a1020",
            border: `1px solid ${priceStatus === "ok" ? "#34d39950" : priceStatus === "error" ? "#f8717150" : "#1e3a5f"}`,
            borderRadius: 20, padding: "4px 16px", cursor: priceStatus === "loading" ? "wait" : "pointer",
            fontFamily: "inherit", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
            color: priceStatus === "ok" ? "#34d399" : priceStatus === "error" ? "#f87171" : "#93c5fd",
            transition: "all 0.2s",
          }}>
            <span style={{ fontSize: "0.7rem" }}>
              {priceStatus === "loading" ? "⟳" : priceStatus === "ok" ? "✓" : priceStatus === "error" ? "✕" : "↓"}
            </span>
            {priceStatus === "loading" ? "FETCHING PRICES…"
              : priceStatus === "ok"   ? `PRICES LOADED · Jita 4-4`
              : priceStatus === "error" ? "PRICE FETCH FAILED — RETRY"
              : "LOAD MARKET PRICES · Jita 4-4"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* ── CLEAR ALL BUTTON ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <button
            onClick={() => {
              setP4q(emptyQty(Object.keys(P4)));
              setP3q(emptyQty(Object.keys(P3)));
              setP2q(emptyQty(Object.keys(P2)));
              setStock({});
            }}
            style={{
              background: "#1a0a0a", border: "1px solid #7f1d1d",
              color: "#f87171", fontSize: "0.68rem", fontWeight: 700,
              padding: "7px 18px", borderRadius: 7, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.12em",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => e.target.style.background = "#3b0a0a"}
            onMouseLeave={e => e.target.style.background = "#1a0a0a"}
          >
            ✕ CLEAR ALL
          </button>
        </div>

        {/* ── DEMAND IMPORT ── */}
        <DemandPanel onApply={applyDemand} />

        {/* ── INPUT SECTIONS ── */}
        <InputSection tier="p4" label="ADVANCED COMMODITIES — enter desired output"
          items={Object.keys(P4)} quantities={p4q}
          onChange={setOne(setP4q)} onClear={clearTier(setP4q, Object.keys(P4))} />
        <InputSection tier="p3" label="SPECIALIZED COMMODITIES — enter desired output"
          items={Object.keys(P3)} quantities={p3q}
          onChange={setOne(setP3q)} onClear={clearTier(setP3q, Object.keys(P3))} />
        <InputSection tier="p2" label="REFINED COMMODITIES — enter desired output"
          items={Object.keys(P2)} quantities={p2q}
          onChange={setOne(setP2q)} onClear={clearTier(setP2q, Object.keys(P2))} />

        {/* ── STOCK IMPORT ── */}
        <StockPanel onApply={setStock} />

        {/* ── EMPTY STATE ── */}
        {!hasAny && (
          <div style={{ textAlign: "center", padding: "40px 24px", color: "#1e3a5f", fontSize: "0.75rem", letterSpacing: "0.15em" }}>
            ↑ ENTER QUANTITIES IN ANY TIER ABOVE TO CALCULATE THE FULL PRODUCTION CHAIN
          </div>
        )}

        {/* ── RESULTS ── */}
        {res && hasAny && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>

            {/* Input summary */}
            <div style={{ background: "#0a0f1e", border: "1px solid #1e3a5f", borderRadius: 12, padding: "12px 18px" }}>
              <div style={{ fontSize: "0.6rem", color: "#334155", letterSpacing: "0.18em", marginBottom: 8 }}>CALCULATION INPUT SUMMARY</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 10px" }}>
                {activeP4.map(([n, v]) => (
                  <span key={n} style={{ background: `${TIER_COLORS.p4}15`, border: `1px solid ${TIER_COLORS.p4}30`, borderRadius: 6, padding: "3px 9px", fontSize: "0.72rem", color: TIER_COLORS.p4 }}>
                    P4 {n}: <strong>{fmt(v)}×</strong>
                  </span>
                ))}
                {activeP3direct.map(([n, v]) => (
                  <span key={n} style={{ background: `${TIER_COLORS.p3}15`, border: `1px solid ${TIER_COLORS.p3}30`, borderRadius: 6, padding: "3px 9px", fontSize: "0.72rem", color: TIER_COLORS.p3 }}>
                    P3 {n}: <strong>{fmt(v)}×</strong>
                  </span>
                ))}
                {activeP2direct.map(([n, v]) => (
                  <span key={n} style={{ background: `${TIER_COLORS.p2}15`, border: `1px solid ${TIER_COLORS.p2}30`, borderRadius: 6, padding: "3px 9px", fontSize: "0.72rem", color: TIER_COLORS.p2 }}>
                    P2 {n}: <strong>{fmt(v)}×</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* P3 results */}
            {Object.keys(res.p3Gross).length > 0 && (
              <ResultSection tier="p3" label="P3 — Specialized Commodities Required"
                gross={res.p3Gross} net={res.p3Net} stock={stock} getPrice={getPrice} />
            )}

            {/* P2 results */}
            {Object.keys(res.p2Gross).length > 0 && (
              <ResultSection tier="p2" label="P2 — Refined Commodities Required"
                gross={res.p2Gross} net={res.p2Net} stock={stock} getPrice={getPrice} />
            )}

            {/* P1 results */}
            {Object.keys(res.p1Gross).length > 0 && (
              <P1ResultSection grossData={res.p1Gross} netData={res.p1Net} stock={stock} getPrice={getPrice} />
            )}

            {/* P1 Quick chips – net values */}
            <NetOverview p1Gross={res.p1Gross} p1Net={res.p1Net} />

          </div>
        )}
      </div>
    </div>
  );
}
