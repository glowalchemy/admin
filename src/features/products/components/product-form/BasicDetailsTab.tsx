
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormContext, useWatch } from "react-hook-form";
import { Wand2, Plus, Tag, FolderTree, AlignLeft, Layers, Power, Copy, AlertTriangle, CheckCircle2, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

import { MultiSelectPopover } from "@/features/products/components/MultiSelectPopover";
import { SingleSelectPopover } from "@/features/products/components/SingleSelectPopover";
import { RichTextEditor } from "@/features/products/components/RichTextEditor";
import { computeSeoScore, slugPreviewFromName } from "@/features/products/utils";
import { useCreateCategoryMutation, useSubCategoriesByParentQuery, useSlugCheckQuery, useSlugSuggestionsQuery } from "@/features/products/queries";
import { createSubCategory } from "@/features/products/api";
import type { ProductManagementFormValues } from "@/features/products/types";

interface BasicDetailsTabProps {
  categoriesLoading: boolean;
  categoryOptions: {
    value: string;
    label: string;
    description?: string;
    indent: number;
  }[];
}

export function BasicDetailsTab({
  categoriesLoading,
  categoryOptions,
}: BasicDetailsTabProps) {
  const { control, setValue, getValues, formState } = useFormContext<ProductManagementFormValues>();
  const { toast } = useToast();
  const { id: productId } = useParams();
  const isEditing = Boolean(productId);
  const slugLockRef = useRef(false);
  const prevSelectedCategoryIdRef = useRef<string | undefined>(undefined);
  const savedSlugRef = useRef<string | null>(null);
  const [slugRegenerateRequested, setSlugRegenerateRequested] = useState(false);
  const [debouncedSlug, setDebouncedSlug] = useState("");

  const watchedName = useWatch({ control, name: "basic.name" });
  const watchedSlug = useWatch({ control, name: "basic.slug" });
  const watchedSlugMode = useWatch({ control, name: "basic.slugMode" }) ?? "auto";
  const watchedCategoryIds = useWatch({ control, name: "basic.categoryIds" });

  // Debounce the slug before hitting the backend availability endpoint.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSlug(String(watchedSlug ?? "").trim().toLowerCase()), 400);
    return () => clearTimeout(t);
  }, [watchedSlug]);

  const slugCheck = useSlugCheckQuery(debouncedSlug, productId);
  const slugUnavailable = slugCheck.data && slugCheck.data.available === false;
  const slugSuggestions = useSlugSuggestionsQuery(
    String(watchedName ?? ""),
    productId,
    Boolean(slugUnavailable),
  );

  const seoScore = computeSeoScore(watchedSlug ?? "");

  const selectedCategoryId = watchedCategoryIds?.[0];
  const subCategoriesQuery = useSubCategoriesByParentQuery(selectedCategoryId);

  useEffect(() => {
    const prev = prevSelectedCategoryIdRef.current;
    // Only clear sub-category when the category actually changes (avoid wiping persisted value on initial load/reset)
    if (prev !== undefined && prev !== selectedCategoryId) {
      setValue("basic.subCategoryId", "", { shouldDirty: true, shouldValidate: true });
    }
    prevSelectedCategoryIdRef.current = selectedCategoryId;
  }, [selectedCategoryId, setValue]);

  useEffect(() => {
    if (!selectedCategoryId) return;
    if (!subCategoriesQuery.isSuccess) return;

    const currentSubCategoryId = getValues("basic.subCategoryId");
    if (!currentSubCategoryId) return;

    const isValid = (subCategoriesQuery.data ?? []).some((c) => String(c.id) === String(currentSubCategoryId));
    if (!isValid) {
      setValue("basic.subCategoryId", "", { shouldDirty: true, shouldValidate: true });
    }
  }, [getValues, selectedCategoryId, setValue, subCategoriesQuery.data, subCategoriesQuery.isSuccess]);

  // Category creation state
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryShortDesc, setNewCategoryShortDesc] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [newCategoryParent, setNewCategoryParent] = useState<string | null>(null);
  const [newCategoryOrder, setNewCategoryOrder] = useState<number>(0);
  const [newCategoryActive, setNewCategoryActive] = useState(true);

  // Sub-category creation state
  const [createSubCategoryOpen, setCreateSubCategoryOpen] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState("");

  const createCategoryMutation = useCreateCategoryMutation();

  // Capture the persisted slug once (edit mode) — it is the baseline for the
  // "URL is changing" warning and must never be silently overwritten.
  useEffect(() => {
    if (isEditing && savedSlugRef.current === null && watchedSlug) {
      savedSlugRef.current = String(watchedSlug);
    }
  }, [isEditing, watchedSlug]);

  // Initial setup for slug lock
  useEffect(() => {
    if (watchedSlug) {
      slugLockRef.current = true;
    }
  }, []); // Run once on mount

  // Auto-generate the preview slug (first three meaningful name words).
  // Never silently changes a saved slug while editing — regeneration only
  // happens on explicit request (Generate button / Auto mode selection).
  useEffect(() => {
    if (watchedSlugMode === "custom") return;
    if (slugLockRef.current) return;
    if (isEditing && !slugRegenerateRequested) {
      slugLockRef.current = true;
      return;
    }
    const s = slugPreviewFromName(watchedName ?? "");
    if (!s) return;
    setValue("basic.slug", s, { shouldDirty: true, shouldValidate: true });
  }, [watchedName, watchedSlugMode, isEditing, slugRegenerateRequested, setValue]);

  const generateSlugFromName = () => {
    slugLockRef.current = false;
    setSlugRegenerateRequested(true);
    setValue("basic.slugMode", "auto", { shouldDirty: true, shouldValidate: false });
    const s = slugPreviewFromName(getValues("basic.name"));
    setValue("basic.slug", s, { shouldDirty: true, shouldValidate: true });
    toast({ title: "Slug regenerated", description: "Preview generated from the first three product-name words." });
  };

  const selectSlugMode = (mode: "auto" | "custom") => {
    setValue("basic.slugMode", mode, { shouldDirty: true, shouldValidate: false });
    if (mode === "auto") {
      generateSlugFromName();
    }
  };

  // Lock slug + switch to custom mode when manually edited
  const onSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    slugLockRef.current = true;
    setValue("basic.slugMode", "custom", { shouldDirty: true, shouldValidate: false });
    setValue("basic.slug", e.target.value, { shouldDirty: true, shouldValidate: true });
  };

  const copyProductUrl = async () => {
    const slug = String(watchedSlug ?? "").trim();
    if (!slug) return;
    const url = `https://glowalchemycare.com/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "URL copied", description: url });
    } catch {
      window.prompt("Copy this URL:", url);
    }
  };

  const handleCreateSubCategory = async () => {
    if (!selectedCategoryId) return;
    if (!newSubCategoryName.trim()) {
      toast({ title: "Name required", description: "Please enter a sub category name.", variant: "destructive" });
      return;
    }

    try {
      const res = await createSubCategory({
        name: newSubCategoryName,
        parentId: selectedCategoryId,
        active: true,
        order: 0,
        shortDescription: "",
        description: "",
      });

      setValue("basic.subCategoryId", res.id, { shouldDirty: true, shouldValidate: true });

      await subCategoriesQuery.refetch();

      toast({
        title: "Sub Category Created",
        description: `Successfully created "${newSubCategoryName}".`,
      });

      setCreateSubCategoryOpen(false);
      setNewSubCategoryName("");
    } catch (e) {
      toast({ title: "Error", description: "Failed to create sub category.", variant: "destructive" });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Name required", description: "Please enter a category name.", variant: "destructive" });
      return;
    }

    try {
      const res = await createCategoryMutation.mutateAsync({
        name: newCategoryName,
        parentId: null,
        active: newCategoryActive,
        order: newCategoryOrder,
        shortDescription: newCategoryShortDesc,
        description: newCategoryDesc,
      });

      // Auto-select the newly created category
      const currentIds = getValues("basic.categoryIds") || [];
      setValue("basic.categoryIds", [...currentIds, res.id], { shouldDirty: true, shouldValidate: true });

      toast({ 
        title: "Category Created", 
        description: `Successfully created "${newCategoryName}" and added it to the product.`,
      });

      setCreateCategoryOpen(false);
      // Reset form
      setNewCategoryName("");
      setNewCategoryShortDesc("");
      setNewCategoryDesc("");
      setNewCategoryParent(null);
      setNewCategoryOrder(0);
      setNewCategoryActive(true);
    } catch (e) {
      toast({ title: "Error", description: "Failed to create category.", variant: "destructive" });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="glass lg:col-span-2">
        <CardHeader>
          <CardTitle>Basic Product Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={control}
              name="basic.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Premium Wireless Headphones" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Product URL Slug *</FormLabel>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={watchedSlugMode === "auto" ? "secondary" : "ghost"}
                    className="h-7 px-2 text-xs"
                    onClick={() => selectSlugMode("auto")}
                  >
                    Auto
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={watchedSlugMode === "custom" ? "secondary" : "ghost"}
                    className="h-7 px-2 text-xs"
                    onClick={() => selectSlugMode("custom")}
                  >
                    Custom
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="gap-2 h-7 px-2 text-xs"
                    onClick={generateSlugFromName}
                  >
                    <Wand2 className="h-3 w-3" />
                    Generate
                  </Button>
                </div>
              </div>
              <FormControl>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    name="basic.slug"
                    placeholder="rosemary-water-hair"
                    value={watchedSlug ?? ""}
                    onChange={onSlugChange}
                  />
                </div>
              </FormControl>

              {/* URL preview + copy */}
              {watchedSlug ? (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-1.5">
                  <span className="text-xs text-muted-foreground truncate">
                    glowalchemycare.com/{watchedSlug}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 ml-auto shrink-0"
                    onClick={copyProductUrl}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ) : null}

              {/* Backend availability status */}
              {debouncedSlug && slugCheck.isFetching ? (
                <p className="text-xs text-muted-foreground">Checking availability…</p>
              ) : null}
              {slugCheck.data?.available === true ? (
                <p className="flex items-center gap-1.5 text-xs text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> This URL is available.
                </p>
              ) : null}
              {slugUnavailable ? (
                <div className="space-y-1.5">
                  <p className="flex items-start gap-1.5 text-xs text-destructive">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    {slugCheck.data?.message || "This product URL is already in use. Choose a different slug."}
                  </p>
                  {(slugSuggestions.data?.suggestions?.length ?? 0) > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Try:</span>
                      {slugSuggestions.data!.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="rounded-md border bg-background px-2 py-0.5 text-xs hover:bg-muted"
                          onClick={() => {
                            slugLockRef.current = true;
                            setValue("basic.slugMode", "custom", { shouldDirty: true });
                            setValue("basic.slug", s, { shouldDirty: true, shouldValidate: true });
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {slugCheck.isError ? (
                <p className="text-xs text-muted-foreground">Availability check unavailable — the server will validate on save.</p>
              ) : null}

              {/* Existing-URL change warning */}
              {isEditing && savedSlugRef.current && watchedSlug && watchedSlug !== savedSlugRef.current ? (
                <p className="flex items-start gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  Changing this product URL may affect existing links and search engine indexing. A permanent redirect will be created from the previous URL.
                </p>
              ) : null}

              {formState.errors.basic?.slug && (
                <p className="text-sm font-medium text-destructive">
                  {formState.errors.basic.slug.message}
                </p>
              )}
            </FormItem>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={control}
              name="basic.shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description <span className="text-xs font-normal text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief summary for listings (max 300 chars)"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground text-right">
                    {(field.value || "").length}/300
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={control}
                name="basic.brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand <span className="text-xs font-normal text-muted-foreground">(optional)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Trozzi Audio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 grid-cols-2">
                <FormField
                  control={control}
                  name="basic.status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="basic.visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Visibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <FormField
            control={control}
            name="basic.categoryIds"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel className="text-base">Categories <span className="text-destructive">*</span></FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => setCreateCategoryOpen(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Category
                  </Button>
                </div>
                {categoriesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <FormControl>
                    <MultiSelectPopover
                      value={field.value}
                      onChange={field.onChange}
                      options={categoryOptions}
                      placeholder="Select categories..."
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="basic.subCategoryId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel className="text-base">Sub Category <span className="text-destructive">*</span></FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => setCreateSubCategoryOpen(true)}
                    disabled={!selectedCategoryId}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    + Add Sub Category
                  </Button>
                </div>

                <FormControl>
                  <SingleSelectPopover
                    value={field.value}
                    onChange={(next) => {
                      const picked = (subCategoriesQuery.data ?? []).find((c) => String(c.id) === String(next));

                      // Reject selecting a top-level category (parentId null) or any value not belonging to selected category
                      if (picked && (picked.parentId === null || String(picked.parentId) !== String(selectedCategoryId))) {
                        toast({ title: "Please enter a sub category", variant: "destructive" });
                        field.onChange("");
                        return;
                      }

                      field.onChange(next);
                    }}
                    options={(subCategoriesQuery.data ?? [])
                      .filter((c) => c.active)
                      .map((c) => ({
                        value: c.id,
                        label: c.name,
                        description: `${categoryOptions.find((o) => o.value === selectedCategoryId)?.label ?? ""} / ${c.name}`,
                        indent: 0,
                        searchValue: c.name,
                      }))}
                    placeholder={selectedCategoryId ? "Select sub category..." : "Select category first"}
                    disabled={!selectedCategoryId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="basic.descriptionHtml"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description <span className="text-xs font-normal text-muted-foreground">(optional)</span></FormLabel>
                <FormControl>
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>SEO Slug Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">SEO score</p>
              <p className="font-semibold">{seoScore}/100</p>
            </div>
            <Progress value={seoScore} />
            <div className="text-xs text-muted-foreground">
              Keep slug readable, short, and hyphen-separated.
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Quick Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">/{watchedSlug || "your-product"}</p>
              <p className="text-xs text-muted-foreground">Public URL (mock)</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Primary category</p>
              <p className="font-medium">
                {categoryOptions.find((o) => o.value === getValues("basic.categoryIds")?.[0])?.label ?? "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Brand</p>
              <p className="font-medium">{getValues("basic.brand") || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Define the details for the new product category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="catName" className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Category Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="catName"
                  placeholder="e.g. Smart Home Devices"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentCat" className="flex items-center gap-2">
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                  Parent Category
                </Label>
                <Select
                  value="none"
                  onValueChange={() => setNewCategoryParent(null)}
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Root (No Parent)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Root (No Parent)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

               <div className="space-y-2">
                <Label htmlFor="catOrder" className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  Sort Order
                </Label>
                <Input
                  id="catOrder"
                  type="number"
                  value={newCategoryOrder}
                  onChange={(e) => setNewCategoryOrder(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catShortDesc" className="flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-muted-foreground" />
                Short Description
              </Label>
              <Input
                id="catShortDesc"
                placeholder="Brief summary..."
                value={newCategoryShortDesc}
                onChange={(e) => setNewCategoryShortDesc(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="catDesc">Detailed Description</Label>
              <Textarea
                id="catDesc"
                placeholder="Full description of this category..."
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <Power className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label htmlFor="catActive" className="mb-0">Active Status</Label>
                <p className="text-xs text-muted-foreground">Visible in store</p>
              </div>
              <Switch
                id="catActive"
                checked={newCategoryActive}
                onCheckedChange={setNewCategoryActive}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={createCategoryMutation.isPending}>
              {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createSubCategoryOpen} onOpenChange={setCreateSubCategoryOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Sub Category</DialogTitle>
            <DialogDescription>
              Add a sub category under the selected category.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="subCatParent" className="flex items-center gap-2">
                <FolderTree className="h-4 w-4 text-muted-foreground" />
                Parent Category
              </Label>
              <Input
                id="subCatParent"
                value={categoryOptions.find((o) => o.value === selectedCategoryId)?.label ?? ""}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCatName" className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Sub Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subCatName"
                placeholder="e.g. Ring"
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
                className="font-medium"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateSubCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubCategory} disabled={createCategoryMutation.isPending || !selectedCategoryId}>
              {createCategoryMutation.isPending ? "Creating..." : "Create Sub Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
