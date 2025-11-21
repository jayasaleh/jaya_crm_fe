import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProducts, useCreateProduct, useUpdateProduct, useDeactivateProduct } from "@/hooks/useProducts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product, CreateProductRequest, UpdateProductRequest } from "@/types/product.types";
import { formatRupiah } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  hpp: z.number().positive("HPP must be a positive number"),
  marginPercent: z.number().min(0, "Margin cannot be negative").max(100, "Margin cannot exceed 100%"),
  speedMbps: z.number().int().positive("Speed must be a positive integer").optional().or(z.literal('')),
  bandwidth: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const Products = () => {
  const { user } = useAuthStore();
  const { products, isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deactivateMutation = useDeactivateProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const isManager = user?.role === "MANAGER";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      hpp: 0,
      marginPercent: 0,
      speedMbps: undefined,
      bandwidth: "",
    },
  });

  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        description: editingProduct.description || "",
        hpp: Number(editingProduct.hpp),
        marginPercent: Number(editingProduct.marginPercent),
        speedMbps: editingProduct.speedMbps || undefined,
        bandwidth: editingProduct.bandwidth || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        hpp: 0,
        marginPercent: 0,
        speedMbps: undefined,
        bandwidth: "",
      });
    }
  }, [editingProduct, form]);

  const calculateSellingPrice = (hpp: number, marginPercent: number) => {
    return hpp * (1 + marginPercent / 100);
  };

  const watchedHpp = form.watch("hpp");
  const watchedMargin = form.watch("marginPercent");
  const sellingPrice = calculateSellingPrice(watchedHpp || 0, watchedMargin || 0);

  const onSubmit = async (values: ProductFormValues) => {
    const data: CreateProductRequest | UpdateProductRequest = {
      ...values,
      speedMbps: values.speedMbps === '' ? undefined : values.speedMbps,
    };

    if (editingProduct) {
      await updateMutation.mutateAsync({ id: editingProduct.id, data });
    } else {
      await createMutation.mutateAsync(data as CreateProductRequest);
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteProductId) {
      await deactivateMutation.mutateAsync(deleteProductId);
      setDeleteProductId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Product Master</h1>
          <p className="text-muted-foreground">Manage your internet service packages</p>
        </div>
        {isManager && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProduct(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., 100 Mbps Package"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Product description"
                    {...form.register("description")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hpp">HPP (Cost of Goods Sold) *</Label>
                  <Input
                    id="hpp"
                    type="number"
                    step="0.01"
                    placeholder="Enter cost"
                    {...form.register("hpp", { valueAsNumber: true })}
                  />
                  {form.formState.errors.hpp && (
                    <p className="text-red-500 text-sm">{form.formState.errors.hpp.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marginPercent">Sales Margin (%) *</Label>
                  <Input
                    id="marginPercent"
                    type="number"
                    step="0.01"
                    placeholder="Enter margin percentage"
                    {...form.register("marginPercent", { valueAsNumber: true })}
                  />
                  {form.formState.errors.marginPercent && (
                    <p className="text-red-500 text-sm">{form.formState.errors.marginPercent.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price (Auto-calculated)</Label>
                  <Input
                    id="sellingPrice"
                    value={formatRupiah(sellingPrice)}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speedMbps">Speed (Mbps)</Label>
                  <Input
                    id="speedMbps"
                    type="number"
                    placeholder="e.g., 100"
                    {...form.register("speedMbps", {
                      setValueAs: (v) => (v === '' ? undefined : Number(v)),
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bandwidth">Bandwidth</Label>
                  <Input
                    id="bandwidth"
                    placeholder="e.g., Unlimited"
                    {...form.register("bandwidth")}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingProduct(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingProduct
                      ? updateMutation.isPending
                        ? "Saving..."
                        : "Save Changes"
                      : createMutation.isPending
                      ? "Creating..."
                      : "Create Product"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">HPP</TableHead>
                    <TableHead className="text-right">Margin (%)</TableHead>
                    <TableHead className="text-right">Selling Price</TableHead>
                    <TableHead className="text-right">Speed</TableHead>
                    {isManager && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.description || "-"}
                      </TableCell>
                      <TableCell className="text-right">{formatRupiah(Number(product.hpp))}</TableCell>
                      <TableCell className="text-right">{Number(product.marginPercent).toFixed(2)}%</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatRupiah(Number(product.sellingPrice))}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.speedMbps ? `${product.speedMbps} Mbps` : "-"}
                      </TableCell>
                      {isManager && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteProductId(product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will deactivate the product. It cannot be used in new deals, but existing deals will remain intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deactivateMutation.isPending}
            >
              {deactivateMutation.isPending ? "Deactivating..." : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
