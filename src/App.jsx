import { useState, useRef, useCallback, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "One Size"];
const DEPARTMENTS = ["Men", "Women", "Unisex", "Kids", "Boys", "Girls"];
const QTY_UNITS = ["PCS", "BOX", "CARTOON", "DOZEN"];
const PRESET_COLORS = [
  { name: "Black", hex: "#1a1a1a" }, { name: "White", hex: "#f5f5f5" },
  { name: "Navy", hex: "#1e3a5f" }, { name: "Red", hex: "#dc2626" },
  { name: "Royal Blue", hex: "#2563eb" }, { name: "Sky Blue", hex: "#38bdf8" },
  { name: "Forest Green", hex: "#166534" }, { name: "Olive", hex: "#65a30d" },
  { name: "Maroon", hex: "#7f1d1d" }, { name: "Burgundy", hex: "#881337" },
  { name: "Grey", hex: "#6b7280" }, { name: "Charcoal", hex: "#374151" },
  { name: "Beige", hex: "#d4b896" }, { name: "Camel", hex: "#c2956c" },
  { name: "Brown", hex: "#78350f" }, { name: "Orange", hex: "#ea580c" },
  { name: "Yellow", hex: "#eab308" }, { name: "Pink", hex: "#ec4899" },
  { name: "Purple", hex: "#7c3aed" }, { name: "Teal", hex: "#0f766e" },
];
const CATEGORIES = {
  "Apparel": ["T-Shirts", "Shirts", "Hoodies", "Jackets", "Trousers", "Jeans", "Shorts", "Dresses", "Skirts", "Suits", "Activewear", "Innerwear", "Sleepwear"],
  "Footwear": ["Sneakers", "Formal Shoes", "Sandals", "Boots", "Loafers", "Sports Shoes", "Slippers"],
  "Accessories": ["Bags", "Wallets", "Belts", "Watches", "Sunglasses", "Hats & Caps", "Scarves", "Jewelry"],
  "Electronics": ["Phones", "Earphones", "Chargers", "Cables", "Cases & Covers", "Smartwatches"],
  "Home & Living": ["Bedding", "Towels", "Curtains", "Cushions", "Kitchen", "Decor"],
  "Beauty & Care": ["Skincare", "Haircare", "Fragrances", "Cosmetics"],
};
const SUPPLIERS = ["TechSupply Co", "LeatherCraft", "SportsGear Ltd", "HomeBase Inc", "PaperWorks", "FashionHub", "GlobalTextile", "StyleMakers"];
const MAIN_MATERIALS = ["Cotton 100%", "Polyester 100%", "Cotton-Polyester Blend", "Wool", "Linen", "Silk", "Denim", "Nylon", "Spandex", "Fleece", "Leather", "Faux Leather", "Canvas", "Mesh", "Velvet", "Rayon", "Bamboo", "Viscose"];

// ─── SEED DATA ─────────────────────────────────────────────────────────────────
const SEED_PRODUCTS = [
  {
    id: 1, title: "Premium Cotton Polo", brandName: "Ralph & Co.", styleCode: "RC-POLO-001",
    category: "Apparel", subcategory: "T-Shirts", department: "Men", supplier: "GlobalTextile",
    skuId: "RAL-AP-3412", purchaseValue: "1800.00", dealerPrice: "3200.00", mrp: "5999.00",
    packagingCost: "150.00", mainMaterial: "Cotton 100%", otherMaterial: "", description: "Classic polo shirt.",
    selectedSizes: ["S", "M", "L", "XL", "XXL"], qtyUnit: "PCS", minimumStock: 10, thumbnail: null,
    colors: [
      { name: "Navy", hex: "#1e3a5f", images: [], sizeQtys: { S: 12, M: 20, L: 18, XL: 15, XXL: 8 } },
      { name: "White", hex: "#f5f5f5", images: [], sizeQtys: { S: 10, M: 22, L: 16, XL: 12, XXL: 6 } },
    ],
  },
  {
    id: 2, title: "Classic Denim Jacket", brandName: "UrbanEdge", styleCode: "UE-DEN-204",
    category: "Apparel", subcategory: "Jackets", department: "Unisex", supplier: "FashionHub",
    skuId: "URB-AP-7821", purchaseValue: "3800.00", dealerPrice: "7500.00", mrp: "14999.00",
    packagingCost: "250.00", mainMaterial: "Denim", otherMaterial: "", description: "Rugged denim jacket.",
    selectedSizes: ["S", "M", "L", "XL"], qtyUnit: "PCS", minimumStock: 5, thumbnail: null,
    colors: [
      { name: "Charcoal", hex: "#374151", images: [], sizeQtys: { S: 8, M: 14, L: 11, XL: 7 } },
      { name: "Sky Blue", hex: "#38bdf8", images: [], sizeQtys: { S: 6, M: 10, L: 9, XL: 5 } },
    ],
  },
  {
    id: 3, title: "Leather Tote Bag", brandName: "Craft&Co", styleCode: "CC-BAG-088",
    category: "Accessories", subcategory: "Bags", department: "Women", supplier: "LeatherCraft",
    skuId: "CRA-AC-5530", purchaseValue: "4200.00", dealerPrice: "8800.00", mrp: "17999.00",
    packagingCost: "300.00", mainMaterial: "Leather", otherMaterial: "Metal Zips", description: "Genuine leather tote.",
    selectedSizes: ["One Size"], qtyUnit: "PCS", minimumStock: 8, thumbnail: null,
    colors: [
      { name: "Brown", hex: "#78350f", images: [], sizeQtys: { "One Size": 25 } },
      { name: "Black", hex: "#1a1a1a", images: [], sizeQtys: { "One Size": 30 } },
      { name: "Camel", hex: "#c2956c", images: [], sizeQtys: { "One Size": 18 } },
    ],
  },
  {
    id: 4, title: "Running Sneakers Pro", brandName: "SwiftRun", styleCode: "SR-SNK-412",
    category: "Footwear", subcategory: "Sneakers", department: "Unisex", supplier: "SportsGear Ltd",
    skuId: "SWI-FW-9912", purchaseValue: "5500.00", dealerPrice: "11000.00", mrp: "21999.00",
    packagingCost: "400.00", mainMaterial: "Mesh", otherMaterial: "", description: "High-performance running sneakers.",
    selectedSizes: ["S", "M", "L", "XL"], qtyUnit: "PCS", minimumStock: 6, thumbnail: null,
    colors: [
      { name: "Black", hex: "#1a1a1a", images: [], sizeQtys: { S: 10, M: 18, L: 14, XL: 8 } },
      { name: "Royal Blue", hex: "#2563eb", images: [], sizeQtys: { S: 8, M: 15, L: 12, XL: 6 } },
    ],
  },
  {
    id: 5, title: "Wireless Earphones X1", brandName: "SonicPeak", styleCode: "SP-EAR-X1",
    category: "Electronics", subcategory: "Earphones", department: "Unisex", supplier: "TechSupply Co",
    skuId: "SON-EL-2241", purchaseValue: "2200.00", dealerPrice: "4800.00", mrp: "9999.00",
    packagingCost: "200.00", mainMaterial: "Nylon", otherMaterial: "", description: "Premium wireless earphones.",
    selectedSizes: ["One Size"], qtyUnit: "BOX", minimumStock: 15, thumbnail: null,
    colors: [
      { name: "Black", hex: "#1a1a1a", images: [], sizeQtys: { "One Size": 45 } },
      { name: "White", hex: "#f5f5f5", images: [], sizeQtys: { "One Size": 38 } },
    ],
  },
];

const STOCK_HISTORY_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STOCK_HISTORY = STOCK_HISTORY_MONTHS.map(m => ({
  month: m,
  stockIn: Math.floor(Math.random() * 200) + 80,
  stockOut: Math.floor(Math.random() * 150) + 40,
}));

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#060910", surface: "#0c1018", card: "#101520", cardHover: "#141b26",
  border: "#1c2535", borderAccent: "#2a3548",
  primary: "#3b82f6", primaryGlow: "#3b82f620",
  accent: "#f59e0b", accentGlow: "#f59e0b20",
  success: "#10b981", successGlow: "#10b98120",
  danger: "#ef4444", dangerGlow: "#ef444420",
  purple: "#8b5cf6", warning: "#f97316",
  text: "#e8edf5", muted: "#8896aa", dim: "#3d4f63",
  font: "'Nunito Sans', 'Lexend', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

const glassCard = { background: T.card, border: `1px solid ${T.border}`, borderRadius: 16 };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getProductQty(p) {
  return p.colors.reduce((s, c) => s + p.selectedSizes.reduce((ss, sz) => ss + (Number(c.sizeQtys[sz]) || 0), 0), 0);
}
function getProductPV(p) { return Number(p.purchaseValue) || 0; }
function getProductDP(p) { return Number(p.dealerPrice) || 0; }
function getProductMRP(p) { return Number(p.mrp) || 0; }
function getStockLevel(qty, minStock = 0) {
  if (qty === 0) return { label: "Out of Stock", color: T.danger, bg: T.dangerGlow };
  if (minStock > 0 && qty <= minStock) return { label: "Below Min", color: T.warning, bg: T.warning + "20" };
  if (qty < 20) return { label: "Low Stock", color: T.accent, bg: T.accentGlow };
  if (qty < 60) return { label: "In Stock", color: T.success, bg: T.successGlow };
  return { label: "Well Stocked", color: T.primary, bg: T.primaryGlow };
}
function fmtBDT(val) {
  const n = Number(val) || 0;
  return "\u09f3" + n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function Badge({ color, bg, children, style = {} }) {
  return (
    <span style={{
      background: bg || color + "18", color, border: `1px solid ${color}30`,
      borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 700,
      letterSpacing: 0.4, display: "inline-flex", alignItems: "center", gap: 4, ...style
    }}>{children}</span>
  );
}

function StatCard({ icon, label, value, sub, color, glow }) {
  return (
    <div style={{
      ...glassCard, padding: "22px 24px",
      background: `linear-gradient(135deg, ${T.card} 60%, ${glow || color + "08"})`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", right: -8, top: -8, fontSize: 56, opacity: 0.06 }}>{icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: color || T.text, letterSpacing: -0.5, fontFamily: T.mono }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.dim, marginTop: 6 }}>{sub}</div>}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}44, transparent)` }} />
    </div>
  );
}

function SortIcon({ dir }) {
  if (!dir) return <span style={{ color: T.dim, fontSize: 10 }}>&#x21C5;</span>;
  return <span style={{ color: T.primary, fontSize: 10 }}>{dir === "asc" ? "↑" : "↓"}</span>;
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1 }}>
        {label}{required && <span style={{ color: T.danger, marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inp = {
  background: "#090d14", border: `1px solid ${T.border}`, borderRadius: 8,
  padding: "9px 12px", color: T.text, fontSize: 13, outline: "none",
  width: "100%", boxSizing: "border-box", fontFamily: T.font, transition: "border-color 0.15s",
};
const sel = { ...inp, cursor: "pointer" };
const txta = { ...inp, resize: "vertical", minHeight: 90, lineHeight: 1.6 };
const btn = (color = T.primary, outline = false, sm = false) => ({
  background: outline ? "transparent" : color,
  color: outline ? color : "#fff",
  border: `1px solid ${color}`,
  borderRadius: 8,
  padding: sm ? "6px 13px" : "9px 18px",
  fontSize: sm ? 12 : 13,
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  transition: "all 0.15s",
  whiteSpace: "nowrap",
  fontFamily: T.font,
});
const pill = (active, color = T.primary) => ({
  padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
  background: active ? color : "transparent", color: active ? "#fff" : T.muted,
  border: `1px solid ${active ? color : T.border}`, transition: "all 0.15s",
});

// ─── THUMBNAIL UPLOAD ─────────────────────────────────────────────────────────
function ThumbnailUpload({ value, onChange }) {
  const ref = useRef();
  const handle = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => onChange(e.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div onClick={() => ref.current.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handle(e.dataTransfer.files[0]); }}
        style={{ width: 120, height: 120, border: `2px dashed ${T.border}`, borderRadius: 12, cursor: "pointer", background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {value
          ? <img src={value} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ textAlign: "center", color: T.dim }}><div style={{ fontSize: 28 }}>&#x1F5BC;&#xFE0F;</div><div style={{ fontSize: 10, marginTop: 4 }}>Upload Thumbnail</div></div>}
        <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handle(e.target.files[0])} />
      </div>
      {value && <button style={btn(T.danger, true, true)} onClick={() => onChange(null)}>&#x2715; Remove</button>}
    </div>
  );
}

// ─── COLOR PICKER MODAL ───────────────────────────────────────────────────────
function ColorPickerModal({ onAdd, onClose, existingColors }) {
  const [tab, setTab] = useState("preset");
  const [custom, setCustom] = useState({ name: "", hex: "#3b82f6" });
  const addPreset = (c) => { if (!existingColors.find(e => e.hex === c.hex)) onAdd(c); onClose(); };
  const addCustom = () => { if (!custom.name.trim()) return; onAdd({ name: custom.name.trim(), hex: custom.hex }); onClose(); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...glassCard, padding: 28, width: "min(480px,95vw)", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 18 }}>Add Color Variation</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["preset", "custom"].map(t => (
            <button key={t} style={pill(tab === t)} onClick={() => setTab(t)}>
              {t === "preset" ? "Preset Colors" : "Custom Color"}
            </button>
          ))}
        </div>
        {tab === "preset" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {PRESET_COLORS.map(c => {
              const exists = existingColors.find(e => e.hex === c.hex);
              return (
                <div key={c.hex} onClick={() => !exists && addPreset(c)}
                  style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 8px", textAlign: "center", cursor: exists ? "not-allowed" : "pointer", opacity: exists ? 0.4 : 1 }}
                  onMouseEnter={e => !exists && (e.currentTarget.style.borderColor = c.hex)}
                  onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: c.hex, margin: "0 auto 6px", border: "2px solid #ffffff22" }} />
                  <div style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>{c.name}</div>
                  {exists && <div style={{ fontSize: 10, color: T.dim }}>Added</div>}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Color Name"><input style={inp} placeholder="e.g. Ocean Breeze" value={custom.name} onChange={e => setCustom(c => ({ ...c, name: e.target.value }))} /></Field>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: custom.hex, border: `2px solid ${T.border}`, flexShrink: 0 }} />
              <input type="color" value={custom.hex} onChange={e => setCustom(c => ({ ...c, hex: e.target.value }))} style={{ width: 60, height: 44, border: "none", background: "none", cursor: "pointer" }} />
              <input style={inp} value={custom.hex} onChange={e => setCustom(c => ({ ...c, hex: e.target.value }))} placeholder="#3b82f6" />
            </div>
            <button style={btn()} onClick={addCustom}>Add Color</button>
          </div>
        )}
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <button style={btn(T.dim, true)} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── IMAGE UPLOAD ZONE ────────────────────────────────────────────────────────
function ImageUploadZone({ images, onChange, colorHex }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const processFiles = (files) => {
    Array.from(files).filter(f => f.type.startsWith("image/")).forEach(f => {
      const reader = new FileReader();
      reader.onload = (e) => onChange(prev => [...prev, { url: e.target.result, name: f.name, primary: prev.length === 0 }]);
    });
  };
  return (
    <div>
      <div style={{ border: `2px dashed ${dragging ? colorHex : T.border}`, borderRadius: 10, padding: "16px", textAlign: "center", cursor: "pointer", background: dragging ? colorHex + "08" : T.surface, marginBottom: 10 }}
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}>
        <div style={{ fontSize: 22, marginBottom: 4 }}>&#x1F4F8;</div>
        <div style={{ fontSize: 12, color: T.muted }}>Drop or click to upload product images for this color variation (shows in catalogue)</div>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => processFiles(e.target.files)} />
      </div>
      {images.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: "relative", width: 72, height: 72 }}
              onMouseEnter={e => e.currentTarget.querySelector(".ov").style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.querySelector(".ov").style.opacity = "0"}>
              <img src={img.url} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: img.primary ? `2px solid ${colorHex}` : `1px solid ${T.border}` }} />
              {img.primary && <div style={{ position: "absolute", top: 2, right: 2, background: colorHex, borderRadius: 3, fontSize: 8, padding: "1px 4px", color: "#fff", fontWeight: 700 }}>&#x2605;</div>}
              <div className="ov" style={{ position: "absolute", inset: 0, background: "#000000cc", borderRadius: 8, opacity: 0, transition: "opacity 0.15s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
                {!img.primary && <button style={{ fontSize: 9, background: colorHex, border: "none", borderRadius: 4, padding: "3px 6px", color: "#fff", cursor: "pointer" }} onClick={() => onChange(imgs => imgs.map((im, j) => ({ ...im, primary: j === i })))}>Main</button>}
                <button style={{ fontSize: 9, background: T.danger, border: "none", borderRadius: 4, padding: "3px 6px", color: "#fff", cursor: "pointer" }} onClick={() => onChange(imgs => imgs.filter((_, j) => j !== i))}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SIZE-QTY TABLE ───────────────────────────────────────────────────────────
function SizeQtyTable({ selectedSizes, sizeQtys, onChange, qtyUnit }) {
  if (!selectedSizes.length) return <div style={{ color: T.dim, fontSize: 13, fontStyle: "italic" }}>Select sizes first</div>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {selectedSizes.map(size => (
        <div key={size} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", textAlign: "center", minWidth: 75 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: T.primary, marginBottom: 4 }}>{size}</div>
          <input type="number" min="0" value={sizeQtys[size] || 0}
            onChange={e => onChange(prev => ({ ...prev, [size]: Number(e.target.value) }))}
            style={{ ...inp, textAlign: "center", padding: "5px 6px", fontSize: 14, fontWeight: 700, width: 65 }} />
          <div style={{ fontSize: 9, color: T.dim, marginTop: 3, fontWeight: 700 }}>{qtyUnit || "PCS"}</div>
        </div>
      ))}
      <div style={{ background: T.primary + "12", border: `1px solid ${T.primary}30`, borderRadius: 10, padding: "10px 12px", textAlign: "center", minWidth: 75, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.primary }}>TOTAL</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: T.text }}>{selectedSizes.reduce((s, sz) => s + (Number(sizeQtys[sz]) || 0), 0)}</div>
        <div style={{ fontSize: 9, color: T.primary, fontWeight: 700 }}>{qtyUnit || "PCS"}</div>
      </div>
    </div>
  );
}

// ─── COLOR VARIATION CARD ─────────────────────────────────────────────────────
function ColorVariationCard({ variation, index, selectedSizes, onUpdate, onRemove, totalColors, qtyUnit }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ background: T.surface, border: `1px solid ${variation.hex}33`, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: open ? `1px solid ${T.border}` : "none", background: variation.hex + "0a", cursor: "pointer" }}
        onClick={() => setOpen(o => !o)}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: variation.hex, border: "2px solid #ffffff22" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{variation.name}</div>
            <div style={{ fontSize: 11, color: T.dim }}>{variation.hex} &middot; {variation.images.length} images &middot; {selectedSizes.reduce((s, sz) => s + (Number(variation.sizeQtys[sz]) || 0), 0)} {qtyUnit || "PCS"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {totalColors > 1 && <button style={btn(T.danger, true, true)} onClick={e => { e.stopPropagation(); onRemove(); }}>Remove</button>}
          <span style={{ color: T.muted, fontSize: 16 }}>{open ? "^" : "v"}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: "18px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              Product Images &mdash; {variation.name} <span style={{ color: T.primary, fontSize: 10 }}>(displayed in product catalogue)</span>
            </div>
            <ImageUploadZone images={variation.images} colorHex={variation.hex}
              onChange={updater => onUpdate({ images: typeof updater === "function" ? updater(variation.images) : updater })} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Stock Per Size</div>
            <SizeQtyTable selectedSizes={selectedSizes} sizeQtys={variation.sizeQtys} qtyUnit={qtyUnit}
              onChange={updater => onUpdate({ sizeQtys: typeof updater === "function" ? updater(variation.sizeQtys) : updater })} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── INLINE EDIT CELL ─────────────────────────────────────────────────────────
function InlineEditCell({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  if (editing) {
    return (
      <input autoFocus type="number" value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={() => { onSave(val); setEditing(false); }}
        onKeyDown={e => { if (e.key === "Enter") { onSave(val); setEditing(false); } if (e.key === "Escape") setEditing(false); }}
        style={{ ...inp, width: 70, padding: "3px 7px", fontSize: 12, textAlign: "right" }} />
    );
  }
  return (
    <span onClick={() => { setVal(value); setEditing(true); }}
      style={{ cursor: "pointer", borderBottom: `1px dashed ${T.dim}`, paddingBottom: 1, fontSize: 13 }}
      title="Click to edit">{value}</span>
  );
}

// ─── VARIATION EXPANDER ROW ───────────────────────────────────────────────────
function VariationExpander({ product, onQuickEdit }) {
  return (
    <tr>
      <td colSpan={15} style={{ padding: "0 0 0 60px", background: T.bg }}>
        <div style={{ padding: "16px 20px", borderLeft: `3px solid ${T.primary}`, margin: "0 12px 0 0", background: T.surface, borderRadius: "0 0 10px 10px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            Color x Size Stock Breakdown <span style={{ color: T.dim, fontWeight: 400, textTransform: "none" }}>(click qty to quick-edit &middot; unit: {product.qtyUnit || "PCS"})</span>
          </div>

          {/* Color image strip */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            {product.colors.map((color, ci) => {
              const cImg = color.images.find(i => i.primary) || color.images[0];
              return (
                <div key={ci} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 8, background: T.card, border: `2px solid ${color.hex}55`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {cImg
                      ? <img src={cImg.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                      : <div style={{ width: 30, height: 30, borderRadius: "50%", background: color.hex, border: "1px solid #ffffff22" }} />}
                  </div>
                  <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{color.name}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {product.colors.map((color, ci) => (
              <div key={ci} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: 130, flexShrink: 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: color.hex, border: "2px solid #ffffff22", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{color.name}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {product.selectedSizes.map(sz => (
                    <div key={sz} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "5px 10px", minWidth: 65, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: T.dim, fontWeight: 700 }}>{sz}</div>
                      <InlineEditCell value={color.sizeQtys[sz] || 0}
                        onSave={newVal => onQuickEdit(product.id, ci, sz, Number(newVal))} />
                      <div style={{ fontSize: 9, color: T.dim }}>{product.qtyUnit || "PCS"}</div>
                    </div>
                  ))}
                  <div style={{ background: T.primary + "12", border: `1px solid ${T.primary}30`, borderRadius: 8, padding: "5px 10px", minWidth: 65, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: T.primary, fontWeight: 700 }}>TOTAL</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: T.text }}>{product.selectedSizes.reduce((s, sz) => s + (Number(color.sizeQtys[sz]) || 0), 0)}</div>
                    <div style={{ fontSize: 9, color: T.primary }}>{product.qtyUnit || "PCS"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── PRODUCT FORM MODAL ───────────────────────────────────────────────────────
function ProductFormModal({ product, onSave, onClose }) {
  const freshForm = () => ({
    title: "", brandName: "", styleCode: "", category: "", subcategory: "",
    department: "Unisex", supplier: "", skuId: "", purchaseValue: "", dealerPrice: "",
    mrp: "", packagingCost: "", mainMaterial: "", otherMaterial: "", description: "",
    additionalNotes: "", selectedSizes: ["M", "L", "XL"], colors: [],
    qtyUnit: "PCS", minimumStock: 0, thumbnail: null,
  });
  const [form, setForm] = useState(product ? { ...freshForm(), ...product } : freshForm());
  const [tab, setTab] = useState("info");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customUnit, setCustomUnit] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const subcats = CATEGORIES[form.category] || [];
  const allUnits = [...QTY_UNITS, ...(customUnit && !QTY_UNITS.includes(customUnit) ? [customUnit] : [])];

  const genSKU = () => {
    const prefix = (form.brandName.slice(0, 3) || "PRD").toUpperCase();
    const mid = (form.category.slice(0, 2) || "XX").toUpperCase();
    set("skuId", `${prefix}-${mid}-${Math.floor(Math.random() * 9000 + 1000)}`);
  };

  const handleSubmit = () => {
    if (!form.title || !form.category || form.colors.length === 0) {
      alert("Fill in Title, Category & at least one Color."); return;
    }
    onSave({ ...form, id: product?.id || Date.now() });
  };

  const tabs = [
    { id: "info", label: "1 Info" },
    { id: "variations", label: "2 Variations" },
    { id: "pricing", label: "3 Pricing" },
    { id: "description", label: "4 Details" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 200, overflowY: "auto", padding: "20px 16px" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      {showColorPicker && (
        <ColorPickerModal existingColors={form.colors}
          onAdd={c => set("colors", [...form.colors, { ...c, images: [], sizeQtys: {} }])}
          onClose={() => setShowColorPicker(false)} />
      )}
      <div style={{ ...glassCard, width: "min(920px,100%)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: `1px solid ${T.border}`, background: "linear-gradient(135deg, #101520, #141b2a)" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: T.text }}>{product ? "Edit Product" : "Add New Product"}</div>
            <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>Complete all tabs before saving</div>
          </div>
          <button style={btn(T.dim, true)} onClick={onClose}>Close</button>
        </div>
        <div style={{ display: "flex", gap: 6, padding: "14px 28px", borderBottom: `1px solid ${T.border}`, flexWrap: "wrap" }}>
          {tabs.map(t => <button key={t.id} style={pill(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>)}
        </div>

        <div style={{ padding: "24px 28px", maxHeight: "70vh", overflowY: "auto" }}>

          {/* TAB: INFO */}
          {tab === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Product Thumbnail</div>
                  <ThumbnailUpload value={form.thumbnail} onChange={v => set("thumbnail", v)} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Field label="Product Title" required><input style={inp} placeholder="e.g. Premium Cotton Polo" value={form.title} onChange={e => set("title", e.target.value)} /></Field>
                    <Field label="Brand Name" required><input style={inp} placeholder="e.g. Ralph & Co." value={form.brandName} onChange={e => set("brandName", e.target.value)} /></Field>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
                    <Field label="Category" required>
                      <select style={sel} value={form.category} onChange={e => { set("category", e.target.value); set("subcategory", ""); }}>
                        <option value="">Select...</option>
                        {Object.keys(CATEGORIES).map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Subcategory">
                      <select style={sel} value={form.subcategory} onChange={e => set("subcategory", e.target.value)} disabled={!form.category}>
                        <option value="">Select...</option>
                        {subcats.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Department">
                      <select style={sel} value={form.department} onChange={e => set("department", e.target.value)}>
                        {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </Field>
                    <Field label="Supplier">
                      <select style={sel} value={form.supplier} onChange={e => set("supplier", e.target.value)}>
                        <option value="">Select...</option>
                        {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <Field label="SKU ID" required>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input style={{ ...inp, flex: 1 }} placeholder="AUTO-GEN" value={form.skuId} onChange={e => set("skuId", e.target.value)} />
                    <button style={btn(T.accent, true, true)} onClick={genSKU}>Gen</button>
                  </div>
                </Field>
                <Field label="Style Code"><input style={inp} placeholder="e.g. RC-POLO-001" value={form.styleCode} onChange={e => set("styleCode", e.target.value)} /></Field>
                <Field label="Quantity Unit">
                  <div style={{ display: "flex", gap: 6 }}>
                    <select style={{ ...sel, flex: 1 }} value={form.qtyUnit} onChange={e => set("qtyUnit", e.target.value)}>
                      {allUnits.map(u => <option key={u}>{u}</option>)}
                    </select>
                    <input style={{ ...inp, width: 110 }} placeholder="New unit..." value={customUnit}
                      onChange={e => setCustomUnit(e.target.value.toUpperCase())}
                      onKeyDown={e => { if (e.key === "Enter" && customUnit.trim()) { set("qtyUnit", customUnit.trim()); } }}
                      title="Type custom unit name and press Enter to add" />
                  </div>
                </Field>
              </div>

              {/* Main Material + Other Material */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Main Material">
                  <select style={sel} value={form.mainMaterial} onChange={e => set("mainMaterial", e.target.value)}>
                    <option value="">Select...</option>
                    {MAIN_MATERIALS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Other Material (custom text)">
                  <input style={inp} placeholder="e.g. Metal Zips, Rubber Sole, Foam Padding..." value={form.otherMaterial} onChange={e => set("otherMaterial", e.target.value)} />
                </Field>
              </div>

              {/* Minimum Stock Security */}
              <div style={{ background: T.warning + "10", border: `1px solid ${T.warning}30`, borderRadius: 12, padding: "16px 18px", display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ fontSize: 24 }}>&#x1F512;</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: T.warning, marginBottom: 4 }}>STOCK SECURITY — Minimum Stock Level</div>
                  <div style={{ fontSize: 11, color: T.dim }}>When total stock drops to or below this level, product will be flagged as "Below Min"</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="number" min="0" style={{ ...inp, width: 90, textAlign: "center", fontWeight: 700, fontSize: 16, borderColor: T.warning + "60" }}
                    value={form.minimumStock} onChange={e => set("minimumStock", Number(e.target.value))} />
                  <span style={{ fontSize: 12, color: T.muted }}>{form.qtyUnit || "PCS"}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={btn()} onClick={() => setTab("variations")}>Next: Variations</button>
              </div>
            </div>
          )}

          {/* TAB: VARIATIONS */}
          {tab === "variations" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Select Sizes</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {SIZES.map(sz => {
                    const active = form.selectedSizes.includes(sz);
                    return (
                      <button key={sz} style={{ ...pill(active, T.primary), padding: "6px 14px" }}
                        onClick={() => set("selectedSizes", active ? form.selectedSizes.filter(s => s !== sz) : [...form.selectedSizes, sz])}>
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1.5 }}>Color Variations ({form.colors.length}) — add images per color for catalogue</div>
                  <button style={btn(T.primary, true, true)} onClick={() => setShowColorPicker(true)}>+ Add Color</button>
                </div>
                {form.colors.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px", color: T.dim, border: `2px dashed ${T.border}`, borderRadius: 12 }}>
                    No colors yet — add at least one color variation
                  </div>
                ) : (
                  form.colors.map((v, i) => (
                    <ColorVariationCard key={i} variation={v} index={i} selectedSizes={form.selectedSizes} qtyUnit={form.qtyUnit}
                      onUpdate={patch => set("colors", form.colors.map((c, j) => j === i ? { ...c, ...patch } : c))}
                      onRemove={() => set("colors", form.colors.filter((_, j) => j !== i))}
                      totalColors={form.colors.length} />
                  ))
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button style={btn(T.dim, true)} onClick={() => setTab("info")}>Back: Info</button>
                <button style={btn()} onClick={() => setTab("pricing")}>Next: Pricing</button>
              </div>
            </div>
          )}

          {/* TAB: PRICING */}
          {tab === "pricing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <Field label="Purchase Value (PV)" required>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.danger, fontWeight: 700 }}>&#x09F3;</span>
                    <input style={{ ...inp, paddingLeft: 22 }} type="number" step="0.01" min="0" placeholder="0.00" value={form.purchaseValue} onChange={e => set("purchaseValue", e.target.value)} />
                  </div>
                </Field>
                <Field label="Dealer Price (DP)" required>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.accent, fontWeight: 700 }}>&#x09F3;</span>
                    <input style={{ ...inp, paddingLeft: 22 }} type="number" step="0.01" min="0" placeholder="0.00" value={form.dealerPrice} onChange={e => set("dealerPrice", e.target.value)} />
                  </div>
                </Field>
                <Field label="MRP (Retail Price)" required>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.success, fontWeight: 700 }}>&#x09F3;</span>
                    <input style={{ ...inp, paddingLeft: 22 }} type="number" step="0.01" min="0" placeholder="0.00" value={form.mrp} onChange={e => set("mrp", e.target.value)} />
                  </div>
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
                <Field label="Packaging Cost">
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.muted, fontWeight: 700 }}>&#x09F3;</span>
                    <input style={{ ...inp, paddingLeft: 22 }} type="number" step="0.01" min="0" placeholder="0.00" value={form.packagingCost} onChange={e => set("packagingCost", e.target.value)} />
                  </div>
                </Field>
              </div>
              {(form.purchaseValue && form.mrp) && (
                <div style={{ background: T.success + "10", border: `1px solid ${T.success}30`, borderRadius: 10, padding: "14px 18px", display: "flex", gap: 24 }}>
                  <div><div style={{ fontSize: 10, color: T.dim }}>Margin (BDT)</div><div style={{ fontSize: 16, fontWeight: 900, color: T.success }}>{fmtBDT(Number(form.mrp) - Number(form.purchaseValue))}</div></div>
                  <div><div style={{ fontSize: 10, color: T.dim }}>Margin %</div><div style={{ fontSize: 16, fontWeight: 900, color: T.success }}>{form.purchaseValue > 0 ? (((form.mrp - form.purchaseValue) / form.purchaseValue) * 100).toFixed(1) : 0}%</div></div>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button style={btn(T.dim, true)} onClick={() => setTab("variations")}>Back: Variations</button>
                <button style={btn()} onClick={() => setTab("description")}>Next: Details</button>
              </div>
            </div>
          )}

          {/* TAB: DESCRIPTION */}
          {tab === "description" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Product Description">
                <textarea style={txta} placeholder="Describe features, fit, style, care instructions..." value={form.description} onChange={e => set("description", e.target.value)} />
              </Field>
              <Field label="Additional Notes / Care Instructions">
                <textarea style={{ ...txta, minHeight: 70 }} placeholder="Internal notes, care instructions..." value={form.additionalNotes} onChange={e => set("additionalNotes", e.target.value)} />
              </Field>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button style={btn(T.dim, true)} onClick={() => setTab("pricing")}>Back: Pricing</button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={btn(T.danger, true)} onClick={() => { setForm(freshForm()); setTab("info"); }}>Reset</button>
                  <button style={{ ...btn(T.success), padding: "10px 28px" }} onClick={handleSubmit}>
                    {product ? "Save Changes" : "Add Product"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT VIEW MODAL ───────────────────────────────────────────────────────
function ProductViewModal({ product, onClose }) {
  const [activeColor, setActiveColor] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const color = product.colors[activeColor];
  const allImgs = color?.images || [];
  const mainImg = allImgs[activeImg] || allImgs.find(i => i.primary) || allImgs[0];
  const qty = getProductQty(product);
  const stock = getStockLevel(qty, product.minimumStock);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...glassCard, width: "min(760px,100%)", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${T.border}` }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: T.text }}>{product.title}</div>
            <div style={{ fontSize: 13, color: T.muted }}>{product.brandName} &middot; {product.category} &rsaquo; {product.subcategory}</div>
          </div>
          <button style={btn(T.dim, true)} onClick={onClose}>Close</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: 240 }}>
          <div style={{ background: T.surface, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 220, overflow: "hidden" }}>
              {mainImg
                ? <img src={mainImg.url} style={{ width: "100%", height: 220, objectFit: "cover" }} alt="" />
                : product.thumbnail
                  ? <img src={product.thumbnail} style={{ width: "100%", height: 220, objectFit: "cover" }} alt="" />
                  : <div style={{ fontSize: 60, opacity: 0.3 }}>&#x1F4E6;</div>}
            </div>
            {allImgs.length > 1 && (
              <div style={{ display: "flex", gap: 4, padding: "8px", flexWrap: "wrap", background: T.card }}>
                {allImgs.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 36, height: 36, borderRadius: 6, overflow: "hidden", cursor: "pointer", border: `2px solid ${i === activeImg ? color.hex : T.border}` }}>
                    <img src={img.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              <Badge color={T.primary}>{product.department}</Badge>
              <Badge color={T.muted}>SKU: {product.skuId}</Badge>
              {product.styleCode && <Badge color={T.accent}>Style: {product.styleCode}</Badge>}
              <Badge color={stock.color}>{stock.label}</Badge>
              <Badge color={T.purple}>{product.qtyUnit || "PCS"}</Badge>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: T.dim, fontWeight: 700, marginBottom: 6 }}>COLOR VARIATIONS</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.colors.map((c, i) => {
                  const cImg = c.images.find(img => img.primary) || c.images[0];
                  return (
                    <div key={i} onClick={() => { setActiveColor(i); setActiveImg(0); }}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
                      <div style={{ width: 34, height: 34, borderRadius: 7, overflow: "hidden", border: `2px solid ${activeColor === i ? T.text : "#ffffff22"}`, transition: "border 0.15s" }}>
                        {cImg ? <img src={cImg.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                          : <div style={{ width: "100%", height: "100%", background: c.hex }} />}
                      </div>
                      <span style={{ fontSize: 9, color: activeColor === i ? T.text : T.dim }}>{c.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {product.selectedSizes.map(sz => (
                <div key={sz} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 12 }}>
                  <span style={{ color: T.muted }}>{sz}: </span>
                  <span style={{ color: T.text, fontWeight: 700 }}>{color?.sizeQtys[sz] || 0}</span>
                  <span style={{ color: T.dim, fontSize: 10 }}> {product.qtyUnit || "PCS"}</span>
                </div>
              ))}
            </div>
            {product.minimumStock > 0 && (
              <div style={{ fontSize: 12, color: T.warning, marginBottom: 12 }}>&#x1F512; Min Stock: {product.minimumStock} {product.qtyUnit || "PCS"}</div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Purchase Value", val: fmtBDT(product.purchaseValue), color: T.danger },
                { label: "Dealer Price", val: fmtBDT(product.dealerPrice), color: T.accent },
                { label: "MRP", val: fmtBDT(product.mrp), color: T.success },
              ].map(p => (
                <div key={p.label} style={{ background: T.surface, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: T.dim, fontWeight: 700, textTransform: "uppercase" }}>{p.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: p.color, marginTop: 4 }}>{p.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(product.mainMaterial || product.otherMaterial) && (
          <div style={{ padding: "14px 24px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 16, flexWrap: "wrap" }}>
            {product.mainMaterial && <div><span style={{ fontSize: 10, color: T.dim, fontWeight: 700 }}>MAIN MATERIAL: </span><span style={{ fontSize: 12, color: T.muted }}>{product.mainMaterial}</span></div>}
            {product.otherMaterial && <div><span style={{ fontSize: 10, color: T.dim, fontWeight: 700 }}>OTHER MATERIAL: </span><span style={{ fontSize: 12, color: T.muted }}>{product.otherMaterial}</span></div>}
          </div>
        )}
        {product.description && (
          <div style={{ padding: "18px 24px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Description</div>
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>{product.description}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRINT REPORT ─────────────────────────────────────────────────────────────
function buildPrintReport(products) {
  const now = new Date().toLocaleString("en-BD");

  // Grand totals
  const grandTotalQty = products.reduce((s, p) => s + getProductQty(p), 0);
  const grandTotalCD  = products.reduce((s, p) => s + getProductPV(p)  * getProductQty(p), 0);
  const grandTotalDP  = products.reduce((s, p) => s + getProductDP(p)  * getProductQty(p), 0);
  const grandTotalMRP = products.reduce((s, p) => s + getProductMRP(p) * getProductQty(p), 0);

  // Build one row per color × size variation
  let rowsHtml = "";
  let rowIndex = 0;

  products.forEach(p => {
    const totalProductQty = getProductQty(p);
    const totalCD  = getProductPV(p)  * totalProductQty;
    const totalDP  = getProductDP(p)  * totalProductQty;
    const totalMRP = getProductMRP(p) * totalProductQty;

    // Count total variation rows for rowspan
    const varRowCount = p.colors.reduce((s, c) => s + p.selectedSizes.length, 0);

    let firstVariationInProduct = true;

    p.colors.forEach((color, ci) => {
      let firstSizeInColor = true;
      p.selectedSizes.forEach((sz, si) => {
        const varQty = Number(color.sizeQtys[sz]) || 0;
        const bg = rowIndex % 2 === 0 ? "#ffffff" : "#f8fafc";
        const colorDot = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color.hex};border:1px solid #cbd5e1;vertical-align:middle;margin-right:5px;flex-shrink:0;"></span>`;

        rowsHtml += `<tr style="background:${bg};page-break-inside:avoid;">`;

        // Style Code — rowspan across all color×size rows of this product
        if (firstVariationInProduct) {
          rowsHtml += `<td rowspan="${varRowCount}" style="font-family:monospace;font-size:10px;font-weight:700;color:#b45309;background:${bg};border-bottom:2px solid #cbd5e1;vertical-align:middle;padding:7px 8px;white-space:nowrap;">${p.styleCode || "-"}</td>`;
          // SKU — with thumbnail
          const thumbSrc = p.thumbnail || (p.colors[0]?.images.find(i => i.primary) || p.colors[0]?.images[0])?.url || null;
          const thumbHtml = thumbSrc
            ? `<img src="${thumbSrc}" style="width:44px;height:44px;object-fit:cover;border-radius:6px;border:1px solid #e2e8f0;float:left;margin-right:7px;flex-shrink:0;" />`
            : "";
          rowsHtml += `<td rowspan="${varRowCount}" style="font-size:10px;background:${bg};border-bottom:2px solid #cbd5e1;vertical-align:middle;padding:7px 8px;">
            <div style="display:flex;align-items:center;gap:7px;">
              ${thumbHtml}
              <div>
                <div style="font-weight:700;color:#1e293b;font-size:11px;">${p.title}</div>
                <div style="font-family:monospace;color:#64748b;font-size:9px;margin-top:2px;">${p.skuId || "-"}</div>
              </div>
            </div>
          </td>`;
        }

        // Color — rowspan across all sizes within this color
        if (firstSizeInColor) {
          const colorSizeCount = p.selectedSizes.length;
          const colorImg = color.images.find(i => i.primary) || color.images[0];
          const imgHtml = colorImg
            ? `<img src="${colorImg.url}" style="width:38px;height:38px;object-fit:cover;border-radius:6px;border:1px solid #e2e8f0;display:block;margin-bottom:4px;" />`
            : `<div style="width:38px;height:38px;border-radius:6px;background:${color.hex};border:1px solid #e2e8f0;display:block;margin-bottom:4px;"></div>`;
          rowsHtml += `<td rowspan="${colorSizeCount}" style="font-size:10px;background:${bg};border-bottom:1px solid #e2e8f0;vertical-align:middle;padding:7px 8px;">
            <div style="display:flex;flex-direction:column;align-items:center;gap:3px;min-width:56px;">
              ${imgHtml}
              <div style="display:flex;align-items:center;gap:3px;">${colorDot}<span style="font-weight:700;color:#334155;font-size:9px;">${color.name}</span></div>
            </div>
          </td>`;
        }

        // Size
        rowsHtml += `<td style="font-size:10px;font-weight:700;color:#475569;padding:7px 8px;border-bottom:1px solid #e2e8f0;text-align:center;">${sz}</td>`;

        // Variation Qty
        rowsHtml += `<td style="font-size:11px;font-weight:900;color:#0f172a;padding:7px 8px;border-bottom:1px solid #e2e8f0;text-align:right;">${varQty} <span style="font-size:9px;font-weight:400;color:#94a3b8;">${p.qtyUnit || "PCS"}</span></td>`;

        // Total Qty, Total CD, Total DP, Total MRP — rowspan across all variation rows of this product
        if (firstVariationInProduct) {
          const tdBase = `rowspan="${varRowCount}" style="border-bottom:2px solid #cbd5e1;vertical-align:middle;padding:7px 8px;text-align:right;font-family:monospace;font-size:11px;font-weight:700;background:${bg};"`;
          rowsHtml += `<td ${tdBase} style="border-bottom:2px solid #cbd5e1;vertical-align:middle;padding:7px 8px;text-align:right;font-family:monospace;font-size:11px;font-weight:700;background:${bg};color:#0f172a;">${totalProductQty} <span style="font-size:9px;font-weight:400;color:#94a3b8;">${p.qtyUnit || "PCS"}</span></td>`;
          rowsHtml += `<td ${tdBase} style="border-bottom:2px solid #cbd5e1;vertical-align:middle;padding:7px 8px;text-align:right;font-family:monospace;font-size:11px;font-weight:700;background:${bg};color:#dc2626;">${fmtBDT(totalCD)}</td>`;
          rowsHtml += `<td ${tdBase} style="border-bottom:2px solid #cbd5e1;vertical-align:middle;padding:7px 8px;text-align:right;font-family:monospace;font-size:11px;font-weight:700;background:${bg};color:#d97706;">${fmtBDT(totalDP)}</td>`;
          rowsHtml += `<td ${tdBase} style="border-bottom:2px solid #cbd5e1;vertical-align:middle;padding:7px 8px;text-align:right;font-family:monospace;font-size:11px;font-weight:700;background:${bg};color:#059669;">${fmtBDT(totalMRP)}</td>`;
        }

        rowsHtml += `</tr>`;
        firstSizeInColor = false;
        firstVariationInProduct = false;
        rowIndex++;
      });
    });
  });

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"/>
  <title>Current Stock Report — UniPOS</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap');
    @page { size: A4 landscape; margin: 14mm 10mm 14mm 10mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Nunito Sans', sans-serif; background: #fff; color: #1e293b; font-size: 11px; }

    /* ── HEADER ── */
    .report-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      padding-bottom: 12px; border-bottom: 3px solid #0f172a; margin-bottom: 14px;
    }
    .report-title { font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
    .report-sub   { font-size: 11px; color: #64748b; margin-top: 3px; }
    .report-meta  { text-align: right; font-size: 10px; color: #64748b; line-height: 1.7; }
    .report-meta strong { color: #0f172a; }

    /* ── SUMMARY CARDS ── */
    .summary-bar {
      display: flex; gap: 10px; margin-bottom: 14px;
    }
    .summary-card {
      flex: 1; border-radius: 8px; padding: 10px 12px;
      border: 1px solid #e2e8f0;
    }
    .summary-card .sc-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px; }
    .summary-card .sc-value { font-size: 15px; font-weight: 900; font-family: monospace; }

    .sc-qty   { background: #eff6ff; border-color: #bfdbfe; }
    .sc-qty   .sc-value { color: #1d4ed8; }
    .sc-cd    { background: #fef2f2; border-color: #fecaca; }
    .sc-cd    .sc-value { color: #dc2626; }
    .sc-dp    { background: #fffbeb; border-color: #fde68a; }
    .sc-dp    .sc-value { color: #d97706; }
    .sc-mrp   { background: #f0fdf4; border-color: #bbf7d0; }
    .sc-mrp   .sc-value { color: #059669; }

    /* ── TABLE ── */
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    thead tr { background: #0f172a; color: #fff; }
    th {
      padding: 9px 8px; text-align: left; font-size: 9px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.8px; white-space: nowrap;
    }
    th.r { text-align: right; }
    th.c { text-align: center; }
    td { vertical-align: middle; border-bottom: 1px solid #e2e8f0; }

    /* ── TFOOT TOTALS ── */
    tfoot tr { background: #0f172a; color: #fff; }
    tfoot td {
      padding: 9px 8px; font-size: 10px; font-weight: 800;
      font-family: monospace; text-align: right; border-top: 3px solid #0f172a;
    }
    tfoot td.label { text-align: left; font-size: 10px; font-weight: 900; letter-spacing: 0.5px; }

    /* ── FOOTER ── */
    .report-footer {
      margin-top: 16px; padding-top: 10px; border-top: 1px solid #e2e8f0;
      font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="report-header">
    <div>
      <div class="report-title">&#x1F4E6; Current Stock Report</div>
      <div class="report-sub">UniPOS Inventory Management System &middot; All prices in BDT (৳)</div>
    </div>
    <div class="report-meta">
      <div>Generated: <strong>${now}</strong></div>
      <div>Products: <strong>${products.length}</strong> &nbsp;|&nbsp; Total SKUs listed: <strong>${products.length}</strong></div>
    </div>
  </div>

  <!-- SUMMARY CARDS -->
  <div class="summary-bar">
    <div class="summary-card sc-qty">
      <div class="sc-label">Total Stock Qty</div>
      <div class="sc-value">${grandTotalQty.toLocaleString()}</div>
    </div>
    <div class="summary-card sc-cd">
      <div class="sc-label">Total Cost (CD)</div>
      <div class="sc-value">${fmtBDT(grandTotalCD)}</div>
    </div>
    <div class="summary-card sc-dp">
      <div class="sc-label">Total Dealer Price (DP)</div>
      <div class="sc-value">${fmtBDT(grandTotalDP)}</div>
    </div>
    <div class="summary-card sc-mrp">
      <div class="sc-label">Total MRP Value</div>
      <div class="sc-value">${fmtBDT(grandTotalMRP)}</div>
    </div>
  </div>

  <!-- MAIN TABLE -->
  <table>
    <thead>
      <tr>
        <th>Style Code</th>
        <th>SKU / Title</th>
        <th>Color</th>
        <th class="c">Size</th>
        <th class="r">Var Qty</th>
        <th class="r">Total Qty</th>
        <th class="r">Total CD (৳)</th>
        <th class="r">Total DP (৳)</th>
        <th class="r">Total MRP (৳)</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr>
        <td class="label" colspan="5">&#x2714; Grand Total &mdash; ${products.length} Products, ${rowIndex} Variations</td>
        <td>${grandTotalQty.toLocaleString()}</td>
        <td>${fmtBDT(grandTotalCD)}</td>
        <td>${fmtBDT(grandTotalDP)}</td>
        <td>${fmtBDT(grandTotalMRP)}</td>
      </tr>
    </tfoot>
  </table>

  <div class="report-footer">
    <span>UniPOS Inventory Management &middot; Confidential</span>
    <span>Generated ${now}</span>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body></html>`;
}

// ─── CHARTS SECTION ───────────────────────────────────────────────────────────
function ChartsSection({ products }) {
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const catData = useMemo(() => {
    const map = {};
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + getProductQty(p); });
    return Object.entries(map).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty);
  }, [products]);

  const titleData = useMemo(() =>
    products.map(p => ({ name: p.title.slice(0, 16), qty: getProductQty(p) }))
      .sort((a, b) => b.qty - a.qty).slice(0, 8),
    [products]);

  const sizeData = useMemo(() => {
    const map = {};
    products.forEach(p => p.selectedSizes.forEach(sz => {
      p.colors.forEach(c => { map[sz] = (map[sz] || 0) + (Number(c.sizeQtys[sz]) || 0); });
    }));
    return Object.entries(map).map(([size, qty]) => ({ size, qty })).sort((a, b) => b.qty - a.qty);
  }, [products]);

  const PIE_COLORS = [T.primary, T.accent, T.success, T.danger, T.purple, "#06b6d4", "#f97316", "#84cc16"];

  const tooltipStyle = {
    contentStyle: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, fontFamily: T.font },
    labelStyle: { color: T.text, fontWeight: 700 },
    itemStyle: { color: T.muted },
  };

  if (!products.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>

      {/* Calendar-wise Stock In / Stock Out */}
      <div style={{ ...glassCard, padding: "20px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1.5 }}>Monthly Stock In / Stock Out &mdash; {calYear}</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button style={btn(T.dim, true, true)} onClick={() => setCalYear(y => y - 1)}>&#x2039; {calYear - 1}</button>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text, padding: "0 8px" }}>{calYear}</span>
            <button style={btn(T.dim, true, true)} onClick={() => setCalYear(y => y + 1)}>{calYear + 1} &#x203A;</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={STOCK_HISTORY} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="month" tick={{ fill: T.dim, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T.dim, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: T.muted }} />
            <Bar dataKey="stockIn" name="Stock In" fill={T.success} radius={[4, 4, 0, 0]} />
            <Bar dataKey="stockOut" name="Stock Out" fill={T.danger} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stock by Title + Stock by Sizes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...glassCard, padding: "20px 18px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Stock by Product Title</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={titleData} layout="vertical" margin={{ top: 0, right: 10, left: 70, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: T.dim, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: T.dim, fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="qty" name="Qty" fill={T.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...glassCard, padding: "20px 18px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Stock by Sizes</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sizeData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="size" tick={{ fill: T.dim, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.dim, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="qty" name="Qty" radius={[4, 4, 0, 0]}>
                {sizeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock by Category */}
      <div style={{ ...glassCard, padding: "20px 18px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Stock by Category</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={catData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="name" tick={{ fill: T.dim, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T.dim, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="qty" radius={[4, 4, 0, 0]}>
              {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function InventoryDashboard() {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [activeSection, setActiveSection] = useState("catalogue");
  const PER_PAGE = 10;

  const stats = useMemo(() => {
    const totalQty = products.reduce((s, p) => s + getProductQty(p), 0);
    const totalPV = products.reduce((s, p) => s + getProductPV(p) * getProductQty(p), 0);
    const totalDP = products.reduce((s, p) => s + getProductDP(p) * getProductQty(p), 0);
    const totalMRP = products.reduce((s, p) => s + getProductMRP(p) * getProductQty(p), 0);
    const belowMin = products.filter(p => p.minimumStock > 0 && getProductQty(p) <= p.minimumStock).length;
    return { totalQty, totalPV, totalDP, totalMRP, belowMin };
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.brandName.toLowerCase().includes(q) || p.styleCode?.toLowerCase().includes(q) || p.skuId?.toLowerCase().includes(q));
    }
    if (filterCat) list = list.filter(p => p.category === filterCat);
    if (filterStock) {
      list = list.filter(p => {
        const qty = getProductQty(p);
        if (filterStock === "out") return qty === 0;
        if (filterStock === "low") return qty > 0 && qty < 20;
        if (filterStock === "ok") return qty >= 20;
        if (filterStock === "belowmin") return p.minimumStock > 0 && qty <= p.minimumStock;
        return true;
      });
    }
    if (filterPriceMin) list = list.filter(p => getProductMRP(p) >= Number(filterPriceMin));
    if (filterPriceMax) list = list.filter(p => getProductMRP(p) <= Number(filterPriceMax));

    list.sort((a, b) => {
      let av, bv;
      if (sortField === "title") { av = a.title; bv = b.title; }
      else if (sortField === "brand") { av = a.brandName; bv = b.brandName; }
      else if (sortField === "category") { av = a.category; bv = b.category; }
      else if (sortField === "styleCode") { av = a.styleCode; bv = b.styleCode; }
      else if (sortField === "qty") { av = getProductQty(a); bv = getProductQty(b); }
      else if (sortField === "pv") { av = getProductPV(a); bv = getProductPV(b); }
      else if (sortField === "dp") { av = getProductDP(a); bv = getProductDP(b); }
      else if (sortField === "mrp") { av = getProductMRP(a); bv = getProductMRP(b); }
      else { av = a[sortField] || ""; bv = b[sortField] || ""; }
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [products, search, filterCat, filterStock, filterPriceMin, filterPriceMax, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
    setPage(0);
  };

  const handleSave = (product) => {
    setProducts(ps => {
      const exists = ps.find(p => p.id === product.id);
      return exists ? ps.map(p => p.id === product.id ? product : p) : [...ps, product];
    });
    setShowForm(false);
    setEditProduct(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) setProducts(ps => ps.filter(p => p.id !== id));
  };

  const handleQuickEdit = (productId, colorIdx, size, qty) => {
    setProducts(ps => ps.map(p => {
      if (p.id !== productId) return p;
      const colors = p.colors.map((c, ci) => ci === colorIdx ? { ...c, sizeQtys: { ...c.sizeQtys, [size]: qty } } : c);
      return { ...p, colors };
    }));
  };

  const printReport = () => {
    const html = buildPrintReport(products);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-report-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const TH = ({ field, label, style = {} }) => (
    <th onClick={() => field && toggleSort(field)} style={{
      padding: "11px 14px", textAlign: "left", fontSize: 10, fontWeight: 800, color: T.muted,
      textTransform: "uppercase", letterSpacing: 1.5, cursor: field ? "pointer" : "default",
      whiteSpace: "nowrap", background: T.surface, borderBottom: `1px solid ${T.border}`,
      userSelect: "none", ...style
    }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        {label} {field && <SortIcon dir={sortField === field ? sortDir : null} />}
      </span>
    </th>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a3548; border-radius: 10px; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        select option { background: #101520; }
      `}</style>

      {(showForm || editProduct) && (
        <ProductFormModal product={editProduct} onSave={handleSave} onClose={() => { setShowForm(false); setEditProduct(null); }} />
      )}
      {viewProduct && <ProductViewModal product={viewProduct} onClose={() => setViewProduct(null)} />}

      {/* TOP HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0c1018 0%, #101b2e 100%)", borderBottom: `1px solid ${T.border}`, padding: "16px 28px", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${T.primary}, ${T.purple})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>&#x1F4E6;</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, background: `linear-gradient(135deg, ${T.primary}, #60a5fa)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -0.3 }}>
              UniPOS Inventory
            </div>
            <div style={{ fontSize: 11, color: T.dim, letterSpacing: 0.5 }}>Product Catalogue Management &middot; BDT</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {stats.belowMin > 0 && (
            <span style={{ fontSize: 12, color: T.warning, background: T.warning + "18", border: `1px solid ${T.warning}40`, borderRadius: 8, padding: "5px 12px", fontWeight: 700 }}>
              &#x26A0;&#xFE0F; {stats.belowMin} below min stock
            </span>
          )}
          <span style={{ fontSize: 12, color: T.dim, background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "5px 12px" }}>
            {products.length} products
          </span>
          <button style={btn(T.accent, true, true)} onClick={printReport}>&#x1F5A8; Print Catalogue</button>
          <button style={btn()} onClick={() => { setEditProduct(null); setShowForm(true); }}>+ Add Product</button>
        </div>
      </div>

      <div style={{ maxWidth: 1520, margin: "0 auto", padding: "24px 24px" }}>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
          <StatCard icon="&#x1F4E6;" label="Total Products Qty" value={stats.totalQty.toLocaleString()} sub={`across ${products.length} SKUs`} color={T.primary} glow={T.primaryGlow} />
          <StatCard icon="&#x1F4B8;" label="Total Purchase Value" value={`${(stats.totalPV / 1000).toFixed(1)}K BDT`} sub="Cost of goods in stock" color={T.danger} glow={T.dangerGlow} />
          <StatCard icon="&#x1F3F7;&#xFE0F;" label="Total Dealer Price" value={`${(stats.totalDP / 1000).toFixed(1)}K BDT`} sub="Wholesale valuation" color={T.accent} glow={T.accentGlow} />
          <StatCard icon="&#x1F4B0;" label="Total MRP Value" value={`${(stats.totalMRP / 1000).toFixed(1)}K BDT`} sub="Retail market value" color={T.success} glow={T.successGlow} />
        </div>

        {/* ACTION BAR */}
        <div style={{ ...glassCard, padding: "14px 18px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input style={{ ...inp, width: 220 }} placeholder="Search title, brand, SKU, style..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
          <select style={{ ...sel, width: 150 }} value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(0); }}>
            <option value="">All Categories</option>
            {Object.keys(CATEGORIES).map(c => <option key={c}>{c}</option>)}
          </select>
          <select style={{ ...sel, width: 170 }} value={filterStock} onChange={e => { setFilterStock(e.target.value); setPage(0); }}>
            <option value="">All Stock Levels</option>
            <option value="out">Out of Stock</option>
            <option value="low">Low Stock</option>
            <option value="ok">In Stock</option>
            <option value="belowmin">Below Min Stock</option>
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: T.dim, whiteSpace: "nowrap" }}>MRP BDT</span>
            <input style={{ ...inp, width: 80 }} type="number" placeholder="Min" value={filterPriceMin} onChange={e => { setFilterPriceMin(e.target.value); setPage(0); }} />
            <span style={{ color: T.dim }}>-</span>
            <input style={{ ...inp, width: 80 }} type="number" placeholder="Max" value={filterPriceMax} onChange={e => { setFilterPriceMax(e.target.value); setPage(0); }} />
          </div>
          {(search || filterCat || filterStock || filterPriceMin || filterPriceMax) && (
            <button style={btn(T.dim, true, true)} onClick={() => { setSearch(""); setFilterCat(""); setFilterStock(""); setFilterPriceMin(""); setFilterPriceMax(""); setPage(0); }}>Clear</button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button style={pill(activeSection === "catalogue")} onClick={() => setActiveSection("catalogue")}>Catalogue</button>
            <button style={pill(activeSection === "charts")} onClick={() => setActiveSection("charts")}>Charts</button>
          </div>
        </div>

        {activeSection === "charts" && <ChartsSection products={products} />}

        {activeSection === "catalogue" && (
          <>
            <div style={{ ...glassCard, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1260 }}>
                  <thead>
                    <tr>
                      <TH label="" style={{ width: 42 }} />
                      <TH label="Thumbnail" style={{ width: 70 }} />
                      <TH field="styleCode" label="Style Code" />
                      <TH field="title" label="Title" />
                      <TH field="brand" label="Brand" />
                      <TH field="category" label="Category" />
                      <TH label="Subcategory" />
                      <TH field="qty" label="Qty" />
                      <TH label="Unit" />
                      <TH label="Min Stock" />
                      <TH field="pv" label="PV BDT" />
                      <TH field="dp" label="DP BDT" />
                      <TH field="mrp" label="MRP BDT" />
                      <TH label="Stock" />
                      <TH label="Actions" style={{ textAlign: "center" }} />
                    </tr>
                  </thead>
                  <tbody>
                    {paged.length === 0 ? (
                      <tr><td colSpan={15} style={{ textAlign: "center", padding: "60px 20px", color: T.dim, fontSize: 14 }}>No products match your filters</td></tr>
                    ) : paged.map((p) => {
                      const qty = getProductQty(p);
                      const stock = getStockLevel(qty, p.minimumStock);
                      const isExpanded = expandedRows[p.id];
                      const mainColor = p.colors[0];
                      const mainColorImg = mainColor?.images.find(i => i.primary) || mainColor?.images[0];
                      const thumbSrc = p.thumbnail || mainColorImg?.url || null;

                      return [
                        <tr key={p.id} style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = T.cardHover}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "12px 8px 12px 16px", textAlign: "center" }}>
                            <button onClick={() => setExpandedRows(r => ({ ...r, [p.id]: !r[p.id] }))}
                              style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 6, width: 26, height: 26, cursor: "pointer", color: T.muted, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {isExpanded ? "-" : "+"}
                            </button>
                          </td>
                          <td style={{ padding: "10px 8px" }}>
                            <div style={{ width: 52, height: 52, background: T.surface, borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
                              {thumbSrc ? <img src={thumbSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <span style={{ fontSize: 22, opacity: 0.3 }}>&#x1F4E6;</span>}
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, fontWeight: 700 }}>{p.styleCode || "-"}</span>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                            <div style={{ fontSize: 11, color: T.dim, marginTop: 2, fontFamily: T.mono }}>{p.skuId}</div>
                            {(p.mainMaterial || p.otherMaterial) && <div style={{ fontSize: 10, color: T.dim, marginTop: 1 }}>{p.mainMaterial}{p.otherMaterial ? " + " + p.otherMaterial : ""}</div>}
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ fontSize: 13, color: T.muted }}>{p.brandName}</span>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <Badge color={T.primary}>{p.category}</Badge>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ fontSize: 12, color: T.muted }}>{p.subcategory || "-"}</span>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div style={{ display: "flex", gap: 3 }}>
                                {p.colors.slice(0, 4).map((c, ci) => {
                                  const cImg = c.images.find(i => i.primary) || c.images[0];
                                  return (
                                    <div key={ci} title={c.name} style={{ width: 16, height: 16, borderRadius: "50%", overflow: "hidden", border: "1px solid #ffffff22", background: c.hex, flexShrink: 0 }}>
                                      {cImg && <img src={cImg.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />}
                                    </div>
                                  );
                                })}
                                {p.colors.length > 4 && <span style={{ fontSize: 10, color: T.dim }}>+{p.colors.length - 4}</span>}
                              </div>
                              <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.text }}>{qty}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <Badge color={T.purple}>{p.qtyUnit || "PCS"}</Badge>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            {p.minimumStock > 0
                              ? <span style={{ fontFamily: T.mono, fontSize: 12, color: qty <= p.minimumStock ? T.warning : T.dim, fontWeight: 700 }}>&#x1F512; {p.minimumStock}</span>
                              : <span style={{ color: T.dim, fontSize: 12 }}>-</span>}
                          </td>
                          <td style={{ padding: "12px 14px", fontFamily: T.mono, fontSize: 12, color: T.danger, fontWeight: 700 }}>{fmtBDT(p.purchaseValue)}</td>
                          <td style={{ padding: "12px 14px", fontFamily: T.mono, fontSize: 12, color: T.accent, fontWeight: 700 }}>{fmtBDT(p.dealerPrice)}</td>
                          <td style={{ padding: "12px 14px", fontFamily: T.mono, fontSize: 12, color: T.success, fontWeight: 700 }}>{fmtBDT(p.mrp)}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <Badge color={stock.color} bg={stock.bg}>{stock.label}</Badge>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                              <button style={btn(T.primary, true, true)} onClick={() => setViewProduct(p)} title="View">View</button>
                              <button style={btn(T.accent, true, true)} onClick={() => setEditProduct(p)} title="Edit">Edit</button>
                              <button style={btn(T.danger, true, true)} onClick={() => handleDelete(p.id)} title="Delete">Del</button>
                            </div>
                          </td>
                        </tr>,
                        isExpanded && <VariationExpander key={`exp-${p.id}`} product={p} onQuickEdit={handleQuickEdit} />
                      ];
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 4px" }}>
                <span style={{ fontSize: 12, color: T.dim }}>
                  Showing {page * PER_PAGE + 1}-{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={btn(T.dim, true, true)} onClick={() => setPage(0)} disabled={page === 0}>First</button>
                  <button style={btn(T.dim, true, true)} onClick={() => setPage(p => p - 1)} disabled={page === 0}>Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} style={pill(page === i, T.primary)} onClick={() => setPage(i)}>{i + 1}</button>
                  ))}
                  <button style={btn(T.dim, true, true)} onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next</button>
                  <button style={btn(T.dim, true, true)} onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>Last</button>
                </div>
              </div>
            )}

            <div style={{ textAlign: "center", padding: "8px", fontSize: 12, color: T.dim }}>
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} {filtered.length !== products.length && `(filtered from ${products.length})`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
