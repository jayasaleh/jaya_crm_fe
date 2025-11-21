import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const mockCustomers = [
  { 
    id: 1, 
    name: "Jane Smith", 
    contact: "08234567890",
    services: [
      { package: "50 Mbps Package", status: "Active", startDate: "2024-01-15" },
      { package: "200 Mbps Package", status: "Active", startDate: "2024-02-01" }
    ]
  },
  { 
    id: 2, 
    name: "Alex Johnson", 
    contact: "08345678901",
    services: [
      { package: "100 Mbps Package", status: "Active", startDate: "2024-03-10" }
    ]
  },
  { 
    id: 3, 
    name: "Sarah Williams", 
    contact: "08456789012",
    services: [
      { package: "200 Mbps Package", status: "Active", startDate: "2023-12-05" },
      { package: "50 Mbps Package", status: "Active", startDate: "2024-01-20" }
    ]
  },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active Customers</h1>
        <p className="text-muted-foreground">Manage your subscribed customers and their services</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {mockCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.contact}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 h-fit">
                        {customer.services.length} Active Service{customer.services.length > 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Package</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Start Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customer.services.map((service, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{service.package}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  {service.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{service.startDate}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
