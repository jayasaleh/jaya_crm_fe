import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from "@/hooks/useLeads";
import { LEAD_STATUS, LEAD_SOURCE, STATUS_COLORS } from "@/utils/constants";
import { formatDate } from "@/utils/formatters";
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
import { LeadForm, LeadFormValues } from "@/components/forms/LeadForm";
import { DataTable } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import { Lead, LeadSource, LeadStatus } from "@/types/lead.types";

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteLeadId, setDeleteLeadId] = useState<number | null>(null);

  const { data, isLoading } = useLeads({
    search: searchTerm || undefined,
    status: statusFilter ? (statusFilter as LeadStatus) : undefined,
    source: sourceFilter ? (sourceFilter as LeadSource) : undefined,
    page,
    limit: 10,
  });

  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  const leads = data?.data || [];
  const pagination = data?.pagination;

  const handleSubmit = (formData: LeadFormValues) => {
    if (editingLead) {
      updateMutation.mutate(
        {
          id: editingLead.id,
          data: {
            name: formData.name,
            contact: formData.contact,
            email: formData.email || undefined,
            address: formData.address,
            needs: formData.needs,
            source: formData.source,
            status: formData.status,
          },
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingLead(null);
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          name: formData.name,
          contact: formData.contact,
          email: formData.email || undefined,
          address: formData.address,
          needs: formData.needs,
          source: formData.source,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteLeadId) {
      deleteMutation.mutate(deleteLeadId, {
        onSuccess: () => {
          setDeleteLeadId(null);
        },
      });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSourceFilterChange = (value: string) => {
    setSourceFilter(value);
    setPage(1);
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (lead: Lead) => <span className="font-medium">{lead.name}</span>,
    },
    {
      key: "contact",
      header: "Contact",
    },
    {
      key: "email",
      header: "Email",
      render: (lead: Lead) => lead.email || "-",
    },
    {
      key: "address",
      header: "Address",
      render: (lead: Lead) => lead.address || "-",
    },
    {
      key: "needs",
      header: "Needs",
      render: (lead: Lead) => lead.needs || "-",
    },
    {
      key: "source",
      header: "Source",
      render: (lead: Lead) => <Badge variant="outline">{lead.source}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (lead: Lead) => (
        <Badge
          className={
            STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS] ||
            "bg-gray-100 text-gray-800"
          }
        >
          {lead.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (lead: Lead) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(lead.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (lead: Lead) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(lead)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteLeadId(lead.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const statusOptions = Object.entries(LEAD_STATUS)
    .filter(([_, value]) => value !== LEAD_STATUS.CONVERTED)
    .map(([_, value]) => ({ value, label: value }));

  const sourceOptions = Object.entries(LEAD_SOURCE).map(([_, value]) => ({
    value,
    label: value,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">Manage your potential customers</p>
        </div>
        <Button onClick={() => {
          setEditingLead(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <Card>
        <CardHeader>
          <SearchAndFilter
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search by name, contact, email, address..."
            filters={[
              {
                key: "status",
                value: statusFilter,
                options: statusOptions,
                placeholder: "Status",
                onChange: handleStatusFilterChange,
              },
              {
                key: "source",
                value: sourceFilter,
                options: sourceOptions,
                placeholder: "Source",
                onChange: handleSourceFilterChange,
              },
            ]}
          />
        </CardHeader>
        <CardContent>
          <DataTable
            data={leads}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No leads found"
            keyExtractor={(lead) => lead.id}
          />
          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
              className="mt-4"
            />
          )}
        </CardContent>
      </Card>

      <LeadForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        editingLead={editingLead}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog
        open={!!deleteLeadId}
        onOpenChange={(open) => !open && setDeleteLeadId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Leads;
