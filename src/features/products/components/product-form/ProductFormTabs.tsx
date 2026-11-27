
import { useFormContext } from "react-hook-form";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { PRODUCT_FORM_SECTIONS, countErrorsForFields } from "@/features/products/sections";
import type { ProductManagementFormValues } from "@/features/products/types";

import { BasicDetailsTab } from "./BasicDetailsTab";
import { PricingTab } from "./PricingTab";
import { InventoryTab } from "./InventoryTab";
import { MediaTab } from "./MediaTab";
import { AttributesTab } from "./AttributesTab";
import { SEOTab } from "./SEOTab";
import { ShippingTab } from "./ShippingTab";
import { MarketingTab } from "./MarketingTab";
import { DetailsTab } from "./DetailsTab";
import { SaleTab } from "./SaleTab";

interface ProductFormTabsProps {
  categoriesLoading: boolean;
  categoryOptions: any[];
  productsLoading: boolean;
  productOptions: any[];

  currentTab?: number;
  onTabChange?: (next: number) => void;
}

export function ProductFormTabs({
  categoriesLoading,
  categoryOptions,
  productsLoading,
  productOptions,
  currentTab,
  onTabChange,
}: ProductFormTabsProps) {
  const { formState } = useFormContext<ProductManagementFormValues>();
  const errors = formState.errors;

  const activeTab =
    typeof currentTab === "number"
      ? PRODUCT_FORM_SECTIONS[currentTab]?.id ?? "basic"
      : "basic";

  return (
    <Tabs
      defaultValue="basic"
      className="w-full"
      value={typeof currentTab === "number" ? activeTab : undefined}
      onValueChange={(val) => {
        if (!onTabChange) return;
        const idx = PRODUCT_FORM_SECTIONS.findIndex((t) => t.id === val);
        if (idx >= 0) onTabChange(idx);
      }}
    >
      <TabsList className="glass grid grid-cols-5 lg:grid-cols-10 w-full mb-6">
        {PRODUCT_FORM_SECTIONS.map((t) => {
          const errorCount = countErrorsForFields(errors, t.fields);
          return (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="text-xs sm:text-sm gap-1.5"
              title={errorCount > 0 ? `${errorCount} error${errorCount === 1 ? "" : "s"} in this section` : undefined}
            >
              {t.label}
              {errorCount > 0 ? (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {errorCount}
                </span>
              ) : null}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="basic">
        <BasicDetailsTab
          categoriesLoading={categoriesLoading}
          categoryOptions={categoryOptions}
        />
      </TabsContent>

      <TabsContent value="pricing">
        <PricingTab />
      </TabsContent>

      <TabsContent value="inventory">
        <InventoryTab />
      </TabsContent>

      <TabsContent value="media">
        <MediaTab />
      </TabsContent>

      <TabsContent value="attributes">
        <AttributesTab />
      </TabsContent>

      <TabsContent value="seo">
        <SEOTab />
      </TabsContent>

      <TabsContent value="shipping">
        <ShippingTab />
      </TabsContent>

      <TabsContent value="marketing">
        <MarketingTab
          productsLoading={productsLoading}
          productOptions={productOptions}
        />
      </TabsContent>

      <TabsContent value="details">
        <DetailsTab />
      </TabsContent>

      <TabsContent value="sale">
        <SaleTab />
      </TabsContent>
    </Tabs>
  );
}
