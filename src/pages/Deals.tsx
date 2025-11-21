import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const mockDeals = [
  { 
    id: 1, 
    leadName: "John Doe", 
    products: ["100 Mbps Package"], 
    totalValue: 472500,
    negotiatedPrice: 450000,
    status: "waiting_approval",
    needsApproval: true 
  },
  { 
    id: 2, 
    leadName: "Jane Smith", 
    products: ["50 Mbps Package", "200 Mbps Package"], 
    totalValue: 1100000,
    negotiatedPrice: 1100000,
    status: "approved",
    needsApproval: false 
  },
  { 
    id: 3, 
    leadName: "Bob Wilson", 
    products: ["200 Mbps Package"], 
    totalValue: 840000,
    negotiatedPrice: 750000,
    status: "rejected",
    needsApproval: true 
  },
];

const Deals = () => {
  const [deals, setDeals] = useState(mockDeals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting_approval":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Waiting Approval</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Deal Pipeline</h1>
          <p className="text-muted-foreground">Convert leads to customers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Lead</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">John Doe</SelectItem>
                    <SelectItem value="2">Jane Smith</SelectItem>
                    <SelectItem value="3">Bob Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Products</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">50 Mbps Package - Rp 260,000</SelectItem>
                    <SelectItem value="2">100 Mbps Package - Rp 472,500</SelectItem>
                    <SelectItem value="3">200 Mbps Package - Rp 840,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Negotiated Price</Label>
                <Input type="number" placeholder="Enter negotiated price" />
                <p className="text-xs text-muted-foreground">
                  Price below standard will require manager approval
                </p>
              </div>
              <Button className="w-full">Create Deal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Waiting Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deals.filter(d => d.status === "waiting_approval").map(deal => (
                <Card key={deal.id} className="p-3">
                  <div className="space-y-2">
                    <p className="font-semibold">{deal.leadName}</p>
                    <p className="text-sm text-muted-foreground">{deal.products.join(", ")}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span>Negotiated:</span>
                      <span className="font-semibold">Rp {deal.negotiatedPrice.toLocaleString('id-ID')}</span>
                    </div>
                    {deal.needsApproval && (
                      <Badge variant="outline" className="text-xs">
                        Below standard price
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deals.filter(d => d.status === "approved").map(deal => (
                <Card key={deal.id} className="p-3">
                  <div className="space-y-2">
                    <p className="font-semibold">{deal.leadName}</p>
                    <p className="text-sm text-muted-foreground">{deal.products.join(", ")}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span>Value:</span>
                      <span className="font-semibold">Rp {deal.negotiatedPrice.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deals.filter(d => d.status === "rejected").map(deal => (
                <Card key={deal.id} className="p-3">
                  <div className="space-y-2">
                    <p className="font-semibold">{deal.leadName}</p>
                    <p className="text-sm text-muted-foreground">{deal.products.join(", ")}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span>Requested:</span>
                      <span className="font-semibold">Rp {deal.negotiatedPrice.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Deals;
