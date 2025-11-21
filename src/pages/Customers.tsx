import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/utils/formatters";
import { SERVICE_STATUS, STATUS_COLORS, PAGINATION } from "@/utils/constants";
import { capitalizeFirstLetter } from "@/utils/formatters";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE);
  const [limit] = useState<number>(PAGINATION.DEFAULT_LIMIT);

  const { customers, pagination, isLoading } = useCustomers({
    search: searchTerm || undefined,
    page,
    limit,
  });

  const getStatusBadgeClass = (status: typeof SERVICE_STATUS[keyof typeof SERVICE_STATUS]) => {
    return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active Customers</h1>
        <p className="text-muted-foreground">Manage your subscribed customers and their services</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, code, email, contact..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to first page when searching
                }}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active customers found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => (
                <Card key={customer.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{customer.name}</h3>
                          <div className="flex flex-col gap-1 mt-1">
                            {customer.customerCode && (
                              <p className="text-xs text-muted-foreground">
                                Code: {customer.customerCode}
                              </p>
                            )}
                            {customer.contact && (
                              <p className="text-sm text-muted-foreground">{customer.contact}</p>
                            )}
                            {customer.email && (
                              <p className="text-sm text-muted-foreground">{customer.email}</p>
                            )}
                            {customer.address && (
                              <p className="text-sm text-muted-foreground">{customer.address}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 h-fit">
                          {customer.services?.length || 0} Active Service{(customer.services?.length || 0) > 1 ? 's' : ''}
                        </Badge>
                      </div>

                      {customer.services && customer.services.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Package</TableHead>
                                <TableHead>Speed</TableHead>
                                <TableHead className="text-right">Monthly Fee</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Start Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {customer.services?.map((service) => (
                                <TableRow key={service.id}>
                                  <TableCell className="font-medium">
                                    {service.product.name}
                                  </TableCell>
                                  <TableCell>
                                    {service.product.speedMbps
                                      ? `${service.product.speedMbps} Mbps`
                                      : '-'}
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">
                                    {formatRupiah(Number(service.monthlyFee))}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={getStatusBadgeClass(service.status)}
                                    >
                                      {capitalizeFirstLetter(service.status)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{formatDate(service.startDate)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>No active services</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex justify-end items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                disabled={page === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
