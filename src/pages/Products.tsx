import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const mockProducts = [
  { id: 1, name: "50 Mbps Package", cogs: 200000, margin: 30, sellingPrice: 260000 },
  { id: 2, name: "100 Mbps Package", cogs: 350000, margin: 35, sellingPrice: 472500 },
  { id: 3, name: "200 Mbps Package", cogs: 600000, margin: 40, sellingPrice: 840000 },
];

const Products = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", cogs: 0, margin: 0 });

  const calculateSellingPrice = (cogs: number, margin: number) => {
    return cogs + (cogs * margin / 100);
  };

  const sellingPrice = calculateSellingPrice(formData.cogs, formData.margin);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Product Master</h1>
          <p className="text-muted-foreground">Manage your internet service packages</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input 
                  placeholder="e.g., 100 Mbps Package" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>COGS (Cost of Goods Sold)</Label>
                <Input 
                  type="number" 
                  placeholder="Enter cost"
                  value={formData.cogs || ""}
                  onChange={(e) => setFormData({...formData, cogs: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Sales Margin (%)</Label>
                <Input 
                  type="number" 
                  placeholder="Enter margin percentage"
                  value={formData.margin || ""}
                  onChange={(e) => setFormData({...formData, margin: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Selling Price (Auto-calculated)</Label>
                <Input 
                  value={`Rp ${sellingPrice.toLocaleString('id-ID')}`} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <Button className="w-full">Save Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">COGS</TableHead>
                  <TableHead className="text-right">Margin (%)</TableHead>
                  <TableHead className="text-right">Selling Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">Rp {product.cogs.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">{product.margin}%</TableCell>
                    <TableCell className="text-right font-semibold">
                      Rp {product.sellingPrice.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
