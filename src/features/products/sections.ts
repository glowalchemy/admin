// Single source of truth for the product form tabs. Each section maps to the
// top-level keys of ProductManagementFormValues that it is responsible for
// validating. Keep `fields` in sync with the schema in ./schema.ts.
export interface ProductFormSection {
  id: string;
  label: string;
  fields: string[];
}

export const PRODUCT_FORM_SECTIONS: ProductFormSection[] = [
  { id: "basic", label: "Basic", fields: ["basic"] },
  { id: "pricing", label: "Pricing", fields: ["pricing"] },
  { id: "inventory", label: "Inventory", fields: ["inventory"] },
  { id: "media", label: "Media", fields: ["media"] },
  { id: "attributes", label: "Attributes", fields: ["attributes", "colorVariants"] },
  { id: "seo", label: "SEO", fields: ["seo"] },
  { id: "shipping", label: "Shipping", fields: ["shipping"] },
  { id: "marketing", label: "Marketing", fields: ["marketing"] },
  { id: "details", label: "Details", fields: ["details"] },
  { id: "sale", label: "Sale Page", fields: ["salePage"] },
];

type ErrorNode = Record<string, unknown>;

const isFieldError = (node: unknown): node is { message: string } =>
  !!node &&
  typeof node === "object" &&
  typeof (node as ErrorNode).message === "string";

// Count leaf validation errors that live under any of the given top-level keys.
export function countErrorsForFields(errors: unknown, fields: string[]): number {
  if (!errors || typeof errors !== "object") return 0;
  const root = errors as ErrorNode;
  let count = 0;

  const walk = (node: unknown): void => {
    if (isFieldError(node)) {
      count += 1;
      return;
    }
    if (!node || typeof node !== "object") return;
    for (const value of Object.values(node as ErrorNode)) {
      walk(value);
    }
  };

  for (const field of fields) {
    walk(root[field]);
  }
  return count;
}

// Returns the dot-path (e.g. "basic.name") of the first leaf error found in
// the given errors object, or null when there are no errors.
export function firstErrorPath(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") return null;

  const walk = (node: unknown, path: string): string | null => {
    if (isFieldError(node)) return path;
    if (!node || typeof node !== "object") return null;
    for (const [key, value] of Object.entries(node as ErrorNode)) {
      const found = walk(value, path ? `${path}.${key}` : key);
      if (found) return found;
    }
    return null;
  };

  return walk(errors, "");
}

// Collects every leaf error message under the given top-level keys, e.g.
// for showing a summary of validation problems in a section.
export function collectErrorMessages(errors: unknown, fields: string[]): string[] {
  if (!errors || typeof errors !== "object") return [];
  const root = errors as ErrorNode;
  const messages: string[] = [];

  const walk = (node: unknown): void => {
    if (isFieldError(node)) {
      messages.push(node.message);
      return;
    }
    if (!node || typeof node !== "object") return;
    for (const value of Object.values(node as ErrorNode)) {
      walk(value);
    }
  };

  for (const field of fields) {
    walk(root[field]);
  }
  return messages;
}

// Index of the section that owns the top-level key of the given error path.
export function sectionIndexForErrorPath(path: string | null): number {
  if (!path) return -1;
  const topKey = path.split(".")[0];
  return PRODUCT_FORM_SECTIONS.findIndex((s) => s.fields.includes(topKey));
}

// Dot-path of the first error belonging to a specific section (by index).
export function firstErrorPathInSection(errors: unknown, sectionIndex: number): string | null {
  const section = PRODUCT_FORM_SECTIONS[sectionIndex];
  if (!section || !errors || typeof errors !== "object") return null;

  const root = errors as ErrorNode;
  for (const field of section.fields) {
    const path = firstErrorPath(root[field]);
    if (path) return path ? `${field}.${path}` : field;
  }
  return null;
}
