import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, TrendingUp, Users, DollarSign, FileText, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSalesReport, useDownloadSalesReportExcel } from "@/hooks/useReports";
import { formatRupiah } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filters, setFilters] = useState<{ startDate?: string; endDate?: string } | null>(null);

  // Load all data by default (no filters)
  const { report, isLoading, error } = useSalesReport(filters);
  const downloadMutation = useDownloadSalesReportExcel();

  const handleGenerateReport = () => {
    // If both dates provided, use them; otherwise show all data
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        return;
      }
      setFilters({ startDate, endDate });
    } else {
      // Clear filters to show all data
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

    downloadMutation.mutate({ startDate, endDate });
  };

  const isDateRangeValid = startDate && endDate && new Date(startDate) <= new Date(endDate);

  const summaryCards = report
    ? [
        {
          label: "Total Revenue",
          value: formatRupiah(report.summary.totalRevenue),
          icon: DollarSign,
          color: "text-green-600",
        },
        {
          label: "Total Leads",
          value: report.summary.totalLeads.toString(),
          icon: Users,
          color: "text-blue-600",
        },
        {
          label: "Conversion Rate",
          value: report.summary.conversionRate,
          icon: TrendingUp,
          color: "text-purple-600",
        },
        {
          label: "Approved Deals",
          value: report.summary.approvedDeals.toString(),
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
            <div className="flex items-end">
              <Button
                onClick={handleDownloadExcel}
                disabled={!isDateRangeValid || !report || downloadMutation.isPending}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloadMutation.isPending ? "Downloading..." : "Export Excel"}
              </Button>
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

      {report && !isLoading && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            {summaryCards.map((item) => (
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
                      {report.period.startDate === "All Time" 
                        ? "All Time" 
                        : `${report.period.startDate} to ${report.period.endDate}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Leads:</span>
                    <span className="text-sm font-medium">{report.summary.totalLeads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Converted Leads:</span>
                    <span className="text-sm font-medium">{report.summary.convertedLeads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Conversion Rate:</span>
                    <span className="text-sm font-medium">{report.summary.conversionRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Deals:</span>
                    <span className="text-sm font-medium">{report.summary.totalDeals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Approved Deals:</span>
                    <span className="text-sm font-medium">{report.summary.approvedDeals}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-sm font-semibold">Total Revenue:</span>
                    <span className="text-sm font-bold">{formatRupiah(report.summary.totalRevenue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                {report.topProducts.length > 0 ? (
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
                        {report.topProducts.map((product) => (
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

      {!report && !isLoading && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Loading report data...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
