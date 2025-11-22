import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS, LEAD_SOURCE } from "@/utils/constants";
import { Lead } from "@/types/lead.types";

const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(5, "Contact is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(3, "Address is required"),
  needs: z.string().min(3, "Needs is required"),
  source: z.enum(["WEBSITE", "WALKIN", "PARTNER", "REFERRAL", "OTHER"]),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "LOST"]).optional(),
});

export type LeadFormValues = z.infer<typeof createLeadSchema>;

interface LeadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LeadFormValues) => void;
  editingLead?: Lead | null;
  isLoading?: boolean;
}

export function LeadForm({ open, onOpenChange, onSubmit, editingLead, isLoading }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      source: "OTHER",
      status: "NEW",
    },
  });

  const handleClose = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  // Reset form when editingLead changes
  React.useEffect(() => {
    if (editingLead) {
      setValue("name", editingLead.name);
      setValue("contact", editingLead.contact);
      setValue("email", editingLead.email || "");
      setValue("address", editingLead.address || "");
      setValue("needs", editingLead.needs || "");
      setValue("source", editingLead.source);
      setValue("status", editingLead.status);
    } else {
      reset({
        source: "OTHER",
        status: "NEW",
      });
    }
  }, [editingLead, setValue, reset]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingLead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input placeholder="Enter name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Contact *</Label>
            <Input placeholder="Phone number" {...register("contact")} />
            {errors.contact && <p className="text-sm text-red-500">{errors.contact.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="email@example.com" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Address *</Label>
            <Textarea placeholder="Full address" {...register("address")} />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Needs *</Label>
            <Input placeholder="e.g., 100 Mbps internet" {...register("needs")} />
            {errors.needs && <p className="text-sm text-red-500">{errors.needs.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Source *</Label>
            <Select
              onValueChange={(value) => setValue("source", value as any)}
              value={watch("source")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LEAD_SOURCE).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.source && <p className="text-sm text-red-500">{errors.source.message}</p>}
          </div>
          {editingLead && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select onValueChange={(value) => setValue("status", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_STATUS)
                    .filter(([key, value]) => value !== LEAD_STATUS.CONVERTED)
                    .map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Lead"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

