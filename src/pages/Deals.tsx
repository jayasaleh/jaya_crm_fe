import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertCircle, CheckCircle, XCircle, FileText, Send, Check, X, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDeals, useCreateDeal, useSubmitDeal, useApproveDeal, useRejectDeal, useActivateDeal } from "@/hooks/useDeals";
import { useLeads } from "@/hooks/useLeads";
import { useProducts } from "@/hooks/useProducts";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateDealRequest, Deal } from "@/types/deal.types";
import { DEAL_STATUS, STATUS_COLORS, LEAD_STATUS } from "@/utils/constants";
import { formatRupiah, capitalizeFirstLetter } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
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

const dealItemSchema = z.object({
  productId: z.number().int().positive("Product is required"),
  agreedPrice: z.number().positive("Agreed price must be greater than 0"),
  quantity: z.number().int().positive("Quantity must be at least 1").default(1),
});

const createDealSchema = z.object({
  leadId: z.number().int().positive().optional(),
  customerId: z.number().int().positive().optional(),
  title: z.string().optional(),
  items: z.array(dealItemSchema).min(1, "At least one product is required"),
}).refine((data) => data.leadId || data.customerId, {
  message: "Either lead or customer must be selected",
  path: ["leadId", "customerId"],
});

type DealFormValues = z.infer<typeof createDealSchema>;

const Deals = () => {
  const { user } = useAuthStore();
  const isManager = user?.role === "MANAGER";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "submit" | "activate" | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [statusFilter, setStatusFilter] = useState<typeof DEAL_STATUS[keyof typeof DEAL_STATUS] | "ALL">("ALL");

  const { deals, isLoading } = useDeals(
    statusFilter !== "ALL" ? { status: statusFilter } : undefined
  );
  const leadsQuery = useLeads({ status: LEAD_STATUS.QUALIFIED });
  const { products } = useProducts();
  
  const qualifiedLeads = leadsQuery.data?.data || [];

  const createMutation = useCreateDeal();
  const submitMutation = useSubmitDeal();
  const approveMutation = useApproveDeal();
  const rejectMutation = useRejectDeal();
  const activateMutation = useActivateDeal();

  const form = useForm<DealFormValues>({
    resolver: zodResolver(createDealSchema),
    defaultValues: {
      leadId: undefined,
      customerId: undefined,
      title: "",
      items: [{ productId: 0, agreedPrice: 0, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (values: DealFormValues) => {
    // Filter out items with invalid productId (0 or undefined)
    const validItems = values.items
      .filter(
        (item) => item.productId > 0 && item.agreedPrice > 0 && item.quantity > 0
      )
      .map((item) => ({
        productId: item.productId,
        agreedPrice: item.agreedPrice,
        quantity: item.quantity,
      }));

    if (validItems.length === 0) {
      toast.error("Please add at least one valid product");
      return;
    }

    await createMutation.mutateAsync({
      ...values,
      items: validItems,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleAction = async () => {
    if (!selectedDeal || !actionType) return;

    try {
      if (actionType === "submit") {
        await submitMutation.mutateAsync(selectedDeal.id);
      } else if (actionType === "approve") {
        await approveMutation.mutateAsync({ 
          id: selectedDeal.id, 
          data: actionNote ? { note: actionNote } : undefined 
        });
      } else if (actionType === "reject") {
        await rejectMutation.mutateAsync({ 
          id: selectedDeal.id, 
          data: actionNote ? { note: actionNote } : undefined 
        });
      } else if (actionType === "activate") {
        await activateMutation.mutateAsync(selectedDeal.id);
      }
      setSelectedDeal(null);
      setActionType(null);
      setActionNote("");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const getDealsByStatus = (status: typeof DEAL_STATUS[keyof typeof DEAL_STATUS]) => {
    return deals.filter((deal) => deal.status === status);
  };

  const getStatusBadge = (status: typeof DEAL_STATUS[keyof typeof DEAL_STATUS]) => {
    const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
    return (
      <Badge className={colorClass}>
        {capitalizeFirstLetter(status.replace(/_/g, " "))}
      </Badge>
    );
  };

  const DealCard = ({ deal }: { deal: Deal }) => (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-sm">{deal.customer.name}</p>
            <p className="text-xs text-muted-foreground">{deal.dealNumber}</p>
          </div>
          {getStatusBadge(deal.status)}
        </div>
        <div className="space-y-1">
          {deal.items.map((item, idx) => (
            <div key={idx} className="text-xs text-muted-foreground">
              {item.product.name} × {item.quantity}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm pt-2 border-t">
          <span>Total:</span>
          <span className="font-semibold">{formatRupiah(Number(deal.totalAmount))}</span>
        </div>
        {deal.needsApproval && (
          <Badge variant="outline" className="text-xs w-full justify-center">
            Below standard price
          </Badge>
        )}
        {deal.activatedAt && (
          <Badge variant="outline" className="text-xs w-full justify-center bg-green-50 text-green-700 border-green-200">
            ✓ Activated
          </Badge>
        )}
        <div className="flex gap-2 pt-2">
          {deal.status === DEAL_STATUS.DRAFT && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => {
                setSelectedDeal(deal);
                setActionType("submit");
              }}
            >
              <Send className="h-3 w-3 mr-1" />
              Submit
            </Button>
          )}
          {deal.status === DEAL_STATUS.WAITING_APPROVAL && isManager && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs text-green-600"
                onClick={() => {
                  setSelectedDeal(deal);
                  setActionType("approve");
                  setActionNote("");
                }}
              >
                <Check className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs text-red-600"
                onClick={() => {
                  setSelectedDeal(deal);
                  setActionType("reject");
                  setActionNote("");
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </>
          )}
          {deal.status === DEAL_STATUS.APPROVED && !deal.activatedAt && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => {
                setSelectedDeal(deal);
                setActionType("activate");
              }}
            >
              <Play className="h-3 w-3 mr-1" />
              Activate
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Deal Pipeline</h1>
          <p className="text-muted-foreground">Convert leads to customers</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              {Object.values(DEAL_STATUS).map((status) => (
                <SelectItem key={status} value={status}>
                  {capitalizeFirstLetter(status.replace(/_/g, " "))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => form.reset()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
                <DialogDescription>
                  Create a deal from a qualified lead or existing customer
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Lead (Qualified)</Label>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("leadId", Number(value));
                      form.setValue("customerId", undefined);
                    }}
                    value={form.watch("leadId")?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a qualified lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualifiedLeads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id.toString()}>
                          {lead.name} - {lead.contact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.leadId && (
                    <p className="text-red-500 text-sm">{form.formState.errors.leadId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Deal Title (Optional)</Label>
                  <Input
                    placeholder="e.g., Internet Package for Office"
                    {...form.register("title")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Products *</Label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Select
                          onValueChange={(value) =>
                            form.setValue(`items.${index}.productId`, Number(value))
                          }
                          value={form.watch(`items.${index}.productId`)?.toString() || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name} - {formatRupiah(Number(product.sellingPrice))}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24 space-y-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          {...form.register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          {...form.register(`items.${index}.agreedPrice`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ productId: 0, agreedPrice: 0, quantity: 1 })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Product
                  </Button>
                  {form.formState.errors.items && (
                    <p className="text-red-500 text-sm">{form.formState.errors.items.message}</p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Deal"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-24 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          {Object.values(DEAL_STATUS).map((status) => (
            <Card key={status}>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {status === DEAL_STATUS.DRAFT && <FileText className="h-4 w-4 text-gray-600" />}
                  {status === DEAL_STATUS.WAITING_APPROVAL && (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  {status === DEAL_STATUS.APPROVED && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {status === DEAL_STATUS.REJECTED && (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  {capitalizeFirstLetter(status.replace(/_/g, " "))} (
                  {getDealsByStatus(status).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getDealsByStatus(status).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No deals in this status
                    </p>
                  ) : (
                    getDealsByStatus(status).map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!selectedDeal && !!actionType}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDeal(null);
            setActionType(null);
            setActionNote("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "submit" && "Submit Deal for Approval"}
              {actionType === "approve" && "Approve Deal"}
              {actionType === "reject" && "Reject Deal"}
              {actionType === "activate" && "Activate Deal Services"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "submit" &&
                "Are you sure you want to submit this deal for approval?"}
              {actionType === "approve" &&
                "Are you sure you want to approve this deal?"}
              {actionType === "reject" &&
                "Are you sure you want to reject this deal?"}
              {actionType === "activate" &&
                "This will create active services for the customer. Are you sure?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {(actionType === "approve" || actionType === "reject") && (
            <div className="space-y-2 py-4">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note for this action..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={3}
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={
                actionType === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Deals;
