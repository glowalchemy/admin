/**
 * Admin theme generator.
 *
 * Reads the SHARED GlowAlchemy design tokens (src/design-system/tokens.json,
 * identical to the storefront's) and writes the shadcn HSL variable blocks
 * (src/styles/theme.css) that the admin Tailwind theme consumes.
 *
 * Usage:
 *   node src/design-system/generate.mjs
 *
 * The admin intentionally uses the same palette as the storefront — there is
 * exactly one brand palette across both applications.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const tokens = JSON.parse(readFileSync(join(root, "src", "design-system", "tokens.json"), "utf8"));

function resolve(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    if (typeof value.$ref === "string") {
      return resolve(value.$ref.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), tokens));
    }
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolve(v);
    return out;
  }
  if (typeof value === "string" && value.startsWith("$ref:")) {
    return resolve(value.slice(5).split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), tokens));
  }
  return value;
}

const raw = resolve(tokens.color.raw);
const semantic = resolve(tokens.color.semantic);

function hexToHsl(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hDeg = 0;
  const l = (max + min) / 2;
  const d = max - min;
  let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) hDeg = 60 * (((g - b) / d) % 6);
    else if (max === g) hDeg = 60 * ((b - r) / d + 2);
    else hDeg = 60 * ((r - g) / d + 4);
  }
  if (hDeg < 0) hDeg += 360;
  return `${Math.round(hDeg)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const C = raw; // raw palette shortcuts
const T = semantic.text;
const B = semantic.border;
const A = semantic.action;

const light = {
  "--background": hexToHsl(C.cream),
  "--foreground": hexToHsl(C.charcoal),
  "--card": hexToHsl(C.white),
  "--card-foreground": hexToHsl(C.charcoal),
  "--popover": hexToHsl(C.white),
  "--popover-foreground": hexToHsl(C.charcoal),
  "--primary": hexToHsl(C["deep-forest"]),
  "--primary-foreground": hexToHsl(C.white),
  "--secondary": hexToHsl(C["warm-ivory"]),
  "--secondary-foreground": hexToHsl(C["forest-green"]),
  "--muted": hexToHsl(C["warm-ivory"]),
  "--muted-foreground": hexToHsl(T.secondary),
  "--accent": hexToHsl(C["warm-gold"]),
  "--accent-foreground": hexToHsl(C.charcoal),
  "--destructive": hexToHsl(semantic.status.error),
  "--destructive-foreground": hexToHsl(C.white),
  "--success": hexToHsl(semantic.status.success),
  "--success-foreground": hexToHsl(C.white),
  "--warning": hexToHsl(C["warm-gold"]),
  "--warning-foreground": hexToHsl(C.charcoal),
  "--info": hexToHsl(semantic.status.info),
  "--info-foreground": hexToHsl(C.white),
  "--border": hexToHsl(B.default),
  "--input": hexToHsl(B.default),
  "--ring": hexToHsl(C["warm-gold"]),
  "--radius": "0.75rem",
  "--sidebar-background": hexToHsl(C["deep-forest"]),
  "--sidebar-foreground": hexToHsl(C.cream),
  "--sidebar-primary": hexToHsl(C["warm-gold"]),
  "--sidebar-primary-foreground": hexToHsl(C.charcoal),
  "--sidebar-accent": hexToHsl(C["forest-green"]),
  "--sidebar-accent-foreground": hexToHsl(C.cream),
  "--sidebar-border": hexToHsl("#2E4A3C"),
  "--sidebar-ring": hexToHsl(C["warm-gold"]),
  "--sidebar-muted": hexToHsl("#9AA89F"),
  "--chart-1": hexToHsl(C["deep-forest"]),
  "--chart-2": hexToHsl(C["forest-green"]),
  "--chart-3": hexToHsl(C["warm-gold"]),
  "--chart-4": hexToHsl(C.sage),
  "--chart-5": hexToHsl(C["soft-gold"]),
  "--glass": "0 0% 100% / 0.7",
  "--glass-border": "0 0% 100% / 0.2",
};

const dark = {
  "--background": hexToHsl("#162A22"),
  "--foreground": hexToHsl(C.cream),
  "--card": hexToHsl("#1B3128"),
  "--card-foreground": hexToHsl(C.cream),
  "--popover": hexToHsl("#1B3128"),
  "--popover-foreground": hexToHsl(C.cream),
  "--primary": hexToHsl(C["warm-gold"]),
  "--primary-foreground": hexToHsl(C.charcoal),
  "--secondary": hexToHsl("#244034"),
  "--secondary-foreground": hexToHsl(C.cream),
  "--muted": hexToHsl("#244034"),
  "--muted-foreground": hexToHsl("#A8B5AC"),
  "--accent": hexToHsl(C["warm-gold"]),
  "--accent-foreground": hexToHsl(C.charcoal),
  "--destructive": hexToHsl("#C85A5A"),
  "--destructive-foreground": hexToHsl(C.white),
  "--success": hexToHsl("#5E8A6C"),
  "--success-foreground": hexToHsl(C.white),
  "--warning": hexToHsl(C["warm-gold"]),
  "--warning-foreground": hexToHsl(C.charcoal),
  "--info": hexToHsl("#6E948F"),
  "--info-foreground": hexToHsl(C.white),
  "--border": hexToHsl("#2E4A3C"),
  "--input": hexToHsl("#2E4A3C"),
  "--ring": hexToHsl(C["warm-gold"]),
  "--sidebar-background": hexToHsl("#12241C"),
  "--sidebar-foreground": hexToHsl(C.cream),
  "--sidebar-primary": hexToHsl(C["warm-gold"]),
  "--sidebar-primary-foreground": hexToHsl(C.charcoal),
  "--sidebar-accent": hexToHsl("#244034"),
  "--sidebar-accent-foreground": hexToHsl(C.cream),
  "--sidebar-border": hexToHsl("#2E4A3C"),
  "--sidebar-ring": hexToHsl(C["warm-gold"]),
  "--sidebar-muted": hexToHsl("#9AA89F"),
  "--chart-1": hexToHsl(C["warm-gold"]),
  "--chart-2": hexToHsl(C["forest-green"]),
  "--chart-3": hexToHsl(C.sage),
  "--chart-4": hexToHsl(C["soft-gold"]),
  "--chart-5": hexToHsl(C.cream),
  "--glass": "0 0% 100% / 0.08",
  "--glass-border": "0 0% 100% / 0.12",
};

const block = (vars) =>
  Object.entries(vars)
    .map(([k, v]) => `    ${k}: ${v};`)
    .join("\n");

const output = `/* AUTO-GENERATED from src/design-system/tokens.json — DO NOT EDIT BY HAND. */
/* Regenerate with: node src/design-system/generate.mjs */
/* GlowAlchemy admin theme (shadcn HSL variables, shared palette). */

@layer base {
  :root {
${block(light)}
  }

  .dark {
${block(dark)}
  }
}
`;

writeFileSync(join(root, "src", "styles", "theme.css"), output);
console.log("✅ Generated src/styles/theme.css from tokens.json");
