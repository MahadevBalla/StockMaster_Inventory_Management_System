import { useState } from "react";
import { Download, Filter, RefreshCcw, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const logsData = [
  {
    id: "log1",
    timestamp: "2025-04-19 09:30 AM",
    type: "incoming",
    product: "Blue Widgets",
    quantity: 50,
    warehouse: "Warehouse A",
    user: "Tanay Kinariwala",
  },
  {
    id: "log2",
    timestamp: "2025-04-19 10:15 AM",
    type: "outgoing",
    product: "Red Gadgets",
    quantity: 25,
    warehouse: "Warehouse B",
    user: "Tanay K",
  },
  {
    id: "log3",
    timestamp: "2025-04-18 03:45 PM",
    type: "transfer",
    product: "Green Widgets",
    quantity: 30,
    warehouse: "Warehouse A",
    destination: "Warehouse C",
    user: "Paarth Shah",
  },
  {
    id: "log4",
    timestamp: "2025-04-18 11:20 AM",
    type: "incoming",
    product: "Yellow Gadgets",
    quantity: 100,
    warehouse: "Warehouse B",
    user: "Mahadev",
  },
  {
    id: "log5",
    timestamp: "2025-04-17 02:10 PM",
    type: "outgoing",
    product: "Purple Widgets",
    quantity: 15,
    warehouse: "Warehouse C",
    user: "Aayush Kumar",
  },
];

const Logs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  const handleExportCSV = () => {
    toast({
      title: "CSV Export Started",
      description: "Your movement logs are being exported to CSV.",
    });
    // In a real app, this would trigger a CSV download
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing Data",
      description: "Movement logs are being refreshed.",
    });
    // In a real app, this would refetch the data
  };

  const filteredLogs = logsData.filter((log) => {
    const matchesSearch =
      log.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.warehouse.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || log.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Movement Logs</h1>
          <p className="text-muted-foreground">
            Track all inventory movements and transactions
          </p>
        </div>
        <div className="flex gap-2">
          
         
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs by product, user or warehouse..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={
                        log.type === "incoming" ? "default" :
                          log.type === "outgoing" ? "destructive" :
                            "outline"
                      }>
                        {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.product}</TableCell>
                    <TableCell className="text-right">{log.quantity}</TableCell>
                    <TableCell>
                      {log.type === "transfer"
                        ? `${log.warehouse} → ${log.destination}`
                        : log.warehouse}
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No movement logs found with the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default Logs;
