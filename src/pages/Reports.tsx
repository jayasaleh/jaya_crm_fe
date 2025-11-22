import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, Printer, TrendingUp, Users, DollarSign, FileText, CheckCircle, UserCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useSalesReport, 
  useLeadsReport, 
  useCustomersReport, 
  useDownloadSalesReportExcel,
  useDownloadLeadsReportExcel,
  useDownloadCustomersReportExcel
} from "@/hooks/useReports";
import { formatRupiah, formatDate } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/utils/constants";
import { capitalizeFirstLetter } from "@/utils/formatters";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filters, setFilters] = useState<{ startDate?: string; endDate?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"sales" | "leads" | "customers">("sales");

  // Load all data by default (no filters)
  const { report: salesReport, isLoading: salesLoading, error: salesError } = useSalesReport(
    activeTab === "sales" ? filters : null
  );
  const { report: leadsReport, isLoading: leadsLoading, error: leadsError } = useLeadsReport(
    activeTab === "leads" ? filters : null
  );
  const { report: customersReport, isLoading: customersLoading, error: customersError } = useCustomersReport(
    activeTab === "customers" ? filters : null
  );

  const downloadSalesMutation = useDownloadSalesReportExcel();
  const downloadLeadsMutation = useDownloadLeadsReportExcel();
  const downloadCustomersMutation = useDownloadCustomersReportExcel();

  const isLoading = salesLoading || leadsLoading || customersLoading;
  const error = salesError || leadsError || customersError;

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        return;
      }
      setFilters({ startDate, endDate });
    } else {
      setFilters(null);
    }
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilters(null);
  };

  const handleDownloadExcel = () => {
    if (!startDate || !endDate) {
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      return;
    }

    if (activeTab === "sales") {
      downloadSalesMutation.mutate({ startDate, endDate });
    } else if (activeTab === "leads") {
      downloadLeadsMutation.mutate({ startDate, endDate });
    } else if (activeTab === "customers") {
      downloadCustomersMutation.mutate({ startDate, endDate });
    }
  };

  const handlePrintLeads = () => {
    if (!leadsReport) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const period = leadsReport.period.startDate === "All Time"
      ? "All Time"
      : `${leadsReport.period.startDate} to ${leadsReport.period.endDate}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Leads Report - ${period}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .summary { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 30px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Leads Report</h1>
            <p>Period: ${period}</p>
            <p>Total Leads: ${leadsReport.summary.total}</p>
          </div>
          <div class="summary">
            <h3>Summary by Status:</h3>
            <ul>
              <li>NEW: ${leadsReport.summary.byStatus.NEW}</li>
              <li>CONTACTED: ${leadsReport.summary.byStatus.CONTACTED}</li>
              <li>QUALIFIED: ${leadsReport.summary.byStatus.QUALIFIED}</li>
              <li>CONVERTED: ${leadsReport.summary.byStatus.CONVERTED}</li>
              <li>LOST: ${leadsReport.summary.byStatus.LOST}</li>
            </ul>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Address</th>
                <th>Needs</th>
                <th>Source</th>
                <th>Status</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${leadsReport.leads.map(lead => `
                <tr>
                  <td>${lead.name}</td>
                  <td>${lead.contact}</td>
                  <td>${lead.email || "-"}</td>
                  <td>${lead.address}</td>
                  <td>${lead.needs}</td>
                  <td>${lead.source}</td>
                  <td>${lead.status}</td>
                  <td>${formatDate(lead.createdAt)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const isDateRangeValid = startDate && endDate && new Date(startDate) <= new Date(endDate);

  const salesSummaryCards = salesReport
    ? [
        {
          label: "Total Revenue",
          value: formatRupiah(salesReport.summary.totalRevenue),
          icon: DollarSign,
          color: "text-green-600",
        },
        {
          label: "Total Leads",
          value: salesReport.summary.totalLeads.toString(),
          icon: Users,
          color: "text-blue-600",
        },
        {
          label: "Conversion Rate",
          value: salesReport.summary.conversionRate,
          icon: TrendingUp,
          color: "text-purple-600",
        },
        {
          label: "Approved Deals",
          value: salesReport.summary.approvedDeals.toString(),
          icon: CheckCircle,
          color: "text-teal-600",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and download business reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={handleGenerateReport}
                disabled={isLoading || (startDate && endDate && !isDateRangeValid)}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                {filters ? "Update Report" : "Filter Report"}
              </Button>
              {filters && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  disabled={isLoading}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex items-end gap-2">
              {activeTab === "sales" && (
                <Button
                  onClick={handleDownloadExcel}
                  disabled={!isDateRangeValid || !salesReport || downloadSalesMutation.isPending}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {downloadSalesMutation.isPending ? "Downloading..." : "Export Excel"}
                </Button>
              )}
              {activeTab === "leads" && leadsReport && (
                <>
                  <Button
                    onClick={handlePrintLeads}
                    variant="outline"
                    className="flex-1"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button
                    onClick={handleDownloadExcel}
                    disabled={!isDateRangeValid || downloadLeadsMutation.isPending}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadLeadsMutation.isPending ? "Downloading..." : "Export Excel"}
                  </Button>
                </>
              )}
              {activeTab === "customers" && customersReport && (
                <Button
                  onClick={handleDownloadExcel}
                  disabled={!isDateRangeValid || downloadCustomersMutation.isPending}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {downloadCustomersMutation.isPending ? "Downloading..." : "Export Excel"}
                </Button>
              )}
            </div>
          </div>
          {startDate && endDate && new Date(startDate) > new Date(endDate) && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Start date cannot be after end date.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load report. Please check your date range."}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="leads">Leads Report</TabsTrigger>
          <TabsTrigger value="customers">Customers Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          {isLoading && filters && (
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {salesReport && !isLoading && (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                {salesSummaryCards.map((item) => (
                  <Card key={item.label}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </CardTitle>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{item.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Period:</span>
                        <span className="text-sm font-medium">
                          {salesReport.period.startDate === "All Time"
                            ? "All Time"
                            : `${salesReport.period.startDate} to ${salesReport.period.endDate}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Leads:</span>
                        <span className="text-sm font-medium">{salesReport.summary.totalLeads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Converted Leads:</span>
                        <span className="text-sm font-medium">{salesReport.summary.convertedLeads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Conversion Rate:</span>
                        <span className="text-sm font-medium">{salesReport.summary.conversionRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Deals:</span>
                        <span className="text-sm font-medium">{salesReport.summary.totalDeals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Approved Deals:</span>
                        <span className="text-sm font-medium">{salesReport.summary.approvedDeals}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-sm font-semibold">Total Revenue:</span>
                        <span className="text-sm font-bold">{formatRupiah(salesReport.summary.totalRevenue)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {salesReport.topProducts.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead className="text-right">Sold</TableHead>
                              <TableHead className="text-right">Revenue</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {salesReport.topProducts.map((product) => (
                              <TableRow key={product.productId}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="text-right">{product.sold}</TableCell>
                                <TableCell className="text-right font-semibold">
                                  {formatRupiah(product.revenue)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No products data available for this period.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {!salesReport && !isLoading && !error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Loading report data...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          {isLoading && filters && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {leadsReport && !isLoading && (
            <>
              <div className="grid gap-4 md:grid-cols-5">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{leadsReport.summary.total}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">NEW</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{leadsReport.summary.byStatus.NEW}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">CONTACTED</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{leadsReport.summary.byStatus.CONTACTED}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">QUALIFIED</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{leadsReport.summary.byStatus.QUALIFIED}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">CONVERTED</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{leadsReport.summary.byStatus.CONVERTED}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Leads List</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Period: {leadsReport.period.startDate === "All Time"
                        ? "All Time"
                        : `${leadsReport.period.startDate} to ${leadsReport.period.endDate}`}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Needs</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leadsReport.leads.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No leads found for this period.
                            </TableCell>
                          </TableRow>
                        ) : (
                          leadsReport.leads.map((lead) => (
                            <TableRow key={lead.id}>
                              <TableCell className="font-medium">{lead.name}</TableCell>
                              <TableCell>{lead.contact}</TableCell>
                              <TableCell>{lead.email || "-"}</TableCell>
                              <TableCell>{lead.address}</TableCell>
                              <TableCell>{lead.needs}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{lead.source}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS] ||
                                    "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {lead.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(lead.createdAt)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!leadsReport && !isLoading && !error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Loading leads report data...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          {isLoading && filters && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {customersReport && !isLoading && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customersReport.summary.totalCustomers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customersReport.summary.totalServices}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatRupiah(customersReport.summary.totalRevenue)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Customers List</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Period: {customersReport.period.startDate === "All Time"
                        ? "All Time"
                        : `${customersReport.period.startDate} to ${customersReport.period.endDate}`}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customersReport.customers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No customers found for this period.</p>
                      </div>
                    ) : (
                      customersReport.customers.map((customer) => (
                        <Card key={customer.id}>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
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
                                  {customer.services.length} Active Service{customer.services.length > 1 ? "s" : ""}
                                </Badge>
                              </div>

                              {customer.services.length > 0 && (
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
                                      {customer.services.map((service) => (
                                        <TableRow key={service.id}>
                                          <TableCell className="font-medium">
                                            {service.product.name}
                                          </TableCell>
                                          <TableCell>
                                            {service.product.speedMbps
                                              ? `${service.product.speedMbps} Mbps`
                                              : "-"}
                                          </TableCell>
                                          <TableCell className="text-right font-semibold">
                                            {formatRupiah(Number(service.monthlyFee))}
                                          </TableCell>
                                          <TableCell>
                                            <Badge
                                              className={
                                                STATUS_COLORS[service.status as keyof typeof STATUS_COLORS] ||
                                                "bg-gray-100 text-gray-800"
                                              }
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
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!customersReport && !isLoading && !error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Loading customers report data...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
