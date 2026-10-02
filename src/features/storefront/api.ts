import type {
  OrderCreateInput,
  OrderCreateResponse,
  OrderDetails,
  PublicProduct,
} from "./types";

import type { ProductManagementFormValues } from "@/features/products/types";

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.message ?? msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

interface RawProduct {
  management?: ProductManagementFormValues;
  [key: string]: unknown;
}

function applyManagementToPublicProduct(product: RawProduct): PublicProduct {
  const management: ProductManagementFormValues | undefined = product?.management;
  if (!management) return product as unknown as PublicProduct;

  const next: Record<string, unknown> = { ...product };

  const basic = management.basic ?? ({} as Record<string, unknown>);
  const pricing = management.pricing ?? ({} as Record<string, unknown>);
  const inventory = management.inventory ?? ({} as Record<string, unknown>);
  const marketing = management.marketing ?? ({} as Record<string, unknown>);
  const seo = management.seo ?? ({} as Record<string, unknown>);
  const shipping = management.shipping ?? ({} as Record<string, unknown>);

  if (typeof basic.name === "string" && basic.name.trim()) next.name = basic.name;
  if (typeof inventory.sku === "string" && inventory.sku.trim()) next.sku = inventory.sku;
  if (typeof pricing.sellingPrice === "number" && Number.isFinite(pricing.sellingPrice)) next.price = pricing.sellingPrice;
  if (typeof inventory.stockQuantity === "number" && Number.isFinite(inventory.stockQuantity)) next.stock = inventory.stockQuantity;

  if (typeof basic.status === "string" && basic.status) {
    next.status = basic.status === "archived" ? "inactive" : basic.status;
  }

  if (typeof basic.shortDescription === "string") next.description = basic.shortDescription;
  if (typeof basic.brand === "string") next.brand = basic.brand;
  if (typeof marketing.featured === "boolean") next.featured = marketing.featured;

  if (typeof seo.metaTitle === "string") next.metaTitle = seo.metaTitle;
  if (typeof seo.metaDescription === "string") next.metaDescription = seo.metaDescription;

  if (typeof shipping.weightKg === "number" && Number.isFinite(shipping.weightKg)) next.weight = shipping.weightKg;
  if (shipping.dimensionsCm && typeof shipping.dimensionsCm === "object") next.dimensions = shipping.dimensionsCm;

  return next as PublicProduct;
}

export async function listPublicProducts() {
  const data = await requestJson<RawProduct[]>("/api/products?mode=public");
  return data.map(applyManagementToPublicProduct);
}

export async function getPublicProductBySlug(slug: string) {
  const data = await requestJson<RawProduct>(`/api/products/slug/${encodeURIComponent(slug)}?mode=public`);
  return applyManagementToPublicProduct(data);
}

export async function createOrder(input: OrderCreateInput) {
  return requestJson<OrderCreateResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getOrder(id: string) {
  return requestJson<OrderDetails>(`/api/orders/${id}`);
}
