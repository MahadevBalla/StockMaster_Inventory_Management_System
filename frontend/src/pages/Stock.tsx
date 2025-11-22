import { useState } from "react";
import { Download, Filter, Plus, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Extended stock data based on the updated schema
const stockData = [
  {
    id: "1",
    product: {
      name: "Blue Widgets",
      sku: "BW-1001"
    },
    warehouse: "Warehouse A",
    quantity: 82,
    amount: 8200,
    allocatedQuantity: 10,
    unit: "piece",
    threshold: 25,
    status: "normal",
    lastUpdated: new Date("2025-04-15"),
    batchInfo: {
      batchNumber: "BW-A001",
      expiryDate: new Date("2026-04-15"),
      manufacturingDate: new Date("2025-03-01"),
      supplier: "Widget Suppliers Inc."
    },
    locationInWarehouse: "Aisle 3, Rack B, Shelf 2",
    value: {
      costPrice: 75.50,
      retailPrice: 120.00,
      currency: "INR"
    }
  },
  {
    id: "2",
    product: {
      name: "Blue Widgets",
      sku: "BW-1001"
    },
    warehouse: "Warehouse B",
    quantity: 60,
    amount: 6000,
    allocatedQuantity: 5,
    unit: "piece",
    threshold: 25,
    status: "normal",
    lastUpdated: new Date("2025-04-16"),
    batchInfo: {
      batchNumber: "BW-B002",
      expiryDate: new Date("2026-04-10"),
      manufacturingDate: new Date("2025-03-05"),
      supplier: "Widget Suppliers Inc."
    },
    locationInWarehouse: "Aisle 1, Rack C, Shelf 4",
    value: {
      costPrice: 75.50,
      retailPrice: 120.00,
      currency: "INR"
    }
  },
  {
    id: "3",
    product: {
      name: "Red Gadgets",
      sku: "RG-2002"
    },
    warehouse: "Warehouse A",
    quantity: 45,
    amount: 4500,
    allocatedQuantity: 15,
    unit: "piece",
    threshold: 20,
    status: "normal",
    lastUpdated: new Date("2025-04-17"),
    batchInfo: {
      batchNumber: "RG-A003",
      expiryDate: new Date("2026-05-20"),
      manufacturingDate: new Date("2025-03-20"),
      supplier: "Gadget Makers Ltd."
    },
    locationInWarehouse: "Aisle 4, Rack A, Shelf 1",
    value: {
      costPrice: 45.25,
      retailPrice: 89.99,
      currency: "INR"
    }
  },
  {
    id: "4",
    product: {
      name: "Red Gadgets",
      sku: "RG-2002"
    },
    warehouse: "Warehouse C",
    quantity: 42,
    amount: 4200,
    allocatedQuantity: 0,
    unit: "piece",
    threshold: 20,
    status: "normal",
    lastUpdated: new Date("2025-04-15"),
    batchInfo: {
      batchNumber: "RG-C004",
      expiryDate: new Date("2026-05-15"),
      manufacturingDate: new Date("2025-03-15"),
      supplier: "Gadget Makers Ltd."
    },
    locationInWarehouse: "Aisle 2, Rack D, Shelf 3",
    value: {
      costPrice: 45.25,
      retailPrice: 89.99,
      currency: "INR"
    }
  },
  {
    id: "5",
    product: {
      name: "Green Widgets",
      sku: "GW-3003"
    },
    warehouse: "Warehouse B",
    quantity: 120,
    amount: 7200,
    allocatedQuantity: 20,
    unit: "box",
    threshold: 30,
    status: "normal",
    lastUpdated: new Date("2025-04-16"),
    batchInfo: {
      batchNumber: "GW-B005",
      expiryDate: new Date("2026-06-10"),
      manufacturingDate: new Date("2025-04-01"),
      supplier: "Widget Suppliers Inc."
    },
    locationInWarehouse: "Aisle 5, Rack E, Shelf 2",
    value: {
      costPrice: 35.75,
      retailPrice: 69.99,
      currency: "INR"
    }
  },
  {
    id: "6",
    product: {
      name: "Yellow Gadgets",
      sku: "YG-4004"
    },
    warehouse: "Warehouse A",
    quantity: 12,
    amount: 1200,
    allocatedQuantity: 8,
    unit: "piece",
    threshold: 20,
    status: "low",
    lastUpdated: new Date("2025-04-14"),
    batchInfo: {
      batchNumber: "YG-A006",
      expiryDate: new Date("2026-04-30"),
      manufacturingDate: new Date("2025-03-10"),
      supplier: "Gadget Makers Ltd."
    },
    locationInWarehouse: "Aisle 2, Rack B, Shelf 1",
    value: {
      costPrice: 55.25,
      retailPrice: 99.99,
      currency: "INR"
    }
  },
  {
    id: "7",
    product: {
      name: "Medical Supplies",
      sku: "MS-6006"
    },
    warehouse: "Warehouse C",
    quantity: 45,
    amount: 2250,
    allocatedQuantity: 10,
    unit: "box",
    threshold: 10,
    status: "normal",
    lastUpdated: new Date("2025-04-18"),
    batchInfo: {
      batchNumber: "MS-C007",
      expiryDate: new Date("2025-06-20"),
      manufacturingDate: new Date("2025-01-20"),
      supplier: "MedSupply Co."
    },
    locationInWarehouse: "Aisle 1, Rack A, Shelf 4",
    value: {
      costPrice: 25.50,
      retailPrice: 49.99,
      currency: "INR"
    }
  }
];

const warehouses = [
  "All Warehouses",
  "Warehouse A",
  "Warehouse B",
  "Warehouse C",
];

const Stock = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("All Warehouses");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState("product");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();

  const [newStock, setNewStock] = useState({
    product: "",
    sku: "",
    warehouse: "",
    quantity: 0,
    amount: 0,
    batchNumber: "",
    expiryDate: "",
    manufacturingDate: "",
    supplier: "",
    locationInWarehouse: "",
    costPrice: 0,
    retailPrice: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "quantity" || name === "amount" || name === "costPrice" || name === "retailPrice") {
      setNewStock({ ...newStock, [name]: parseFloat(value) || 0 });
    } else {
      setNewStock({ ...newStock, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewStock({ ...newStock, [name]: value });
  };

  const handleAddStock = () => {
    toast({
      title: "Stock Added",
      description: `Added ${newStock.quantity} units to inventory.`,
    });
    setIsAddStockOpen(false);
    setNewStock({
      product: "",
      sku: "",
      warehouse: "",
      quantity: 0,
      amount: 0,
      batchNumber: "",
      expiryDate: "",
      manufacturingDate: "",
      supplier: "",
      locationInWarehouse: "",
      costPrice: 0,
      retailPrice: 0
    });
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsViewDetailsOpen(true);
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleExportCSV = () => {
    fetch(`${API_BASE_URL}/inventory/export`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        // Set the file name
        a.download = 'inventory-export.csv';

        // Append to the document and trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error downloading CSV:', error);
        // You might want to show an error notification to the user here
      });
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatCurrency = (value: number, currency: string = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency
    }).format(value);
  };

  const filteredStock = stockData
    .filter((item) => {
      const matchesSearch =
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesWarehouse = warehouseFilter === "All Warehouses" || item.warehouse === warehouseFilter;

      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "low" && item.quantity <= item.threshold) ||
        (statusFilter === "normal" && item.quantity > item.threshold);

      return matchesSearch && matchesWarehouse && matchesStatus;
    })
    .sort((a, b) => {
      let compareA, compareB;

      if (sortColumn === "product") {
        compareA = a.product.name;
        compareB = b.product.name;
      } else if (sortColumn === "quantity") {
        compareA = a.quantity;
        compareB = b.quantity;
      } else if (sortColumn === "value") {
        compareA = a.value.retailPrice;
        compareB = b.value.retailPrice;
      } else {
        compareA = a[sortColumn as keyof typeof a];
        compareB = b[sortColumn as keyof typeof b];
      }

      const result = typeof compareA === "string"
        ? compareA.localeCompare(compareB as string)
        : (compareA as number) - (compareB as number);

      return sortDirection === "asc" ? result : -result;
    });

  const productTotals = stockData.reduce((acc, curr) => {
    const key = curr.product.sku;
    if (!acc[key]) {
      acc[key] = {
        product: curr.product.name,
        sku: curr.product.sku,
        total: 0,
        allocated: 0,
        threshold: curr.threshold,
        unit: curr.unit,
        totalValue: 0,
        currency: curr.value.currency
      };
    }
    acc[key].total += curr.quantity;
    acc[key].allocated += curr.allocatedQuantity;
    acc[key].totalValue += curr.quantity * curr.value.retailPrice;
    return acc;
  }, {} as Record<string, { product: string; sku: string; total: number; allocated: number; threshold: number; unit: string; totalValue: number; currency: string }>);

  const productTotalsArray = Object.values(productTotals);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock</h1>
          <p className="text-muted-foreground">
            View and manage current inventory levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>

          <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>

            <DialogContent className="max-w-lg">

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product">Product Name</Label>
                    <Input
                      id="product"
                      name="product"
                      value={newStock.product}
                      onChange={handleInputChange}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={newStock.sku}
                      onChange={handleInputChange}
                      placeholder="SKU"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="warehouse">Warehouse</Label>
                    <Select
                      value={newStock.warehouse}
                      onValueChange={(value) => handleSelectChange("warehouse", value)}
                    >
                      <SelectTrigger id="warehouse">
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.slice(1).map((warehouse) => (
                          <SelectItem key={warehouse} value={warehouse}>
                            {warehouse}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="locationInWarehouse">Location in Warehouse</Label>
                    <Input
                      id="locationInWarehouse"
                      name="locationInWarehouse"
                      value={newStock.locationInWarehouse}
                      onChange={handleInputChange}
                      placeholder="Aisle, Rack, Shelf"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={newStock.quantity || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      value={newStock.amount || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="costPrice">Cost Price</Label>
                    <Input
                      id="costPrice"
                      name="costPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newStock.costPrice || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="retailPrice">Retail Price</Label>
                    <Input
                      id="retailPrice"
                      name="retailPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newStock.retailPrice || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    name="batchNumber"
                    value={newStock.batchNumber}
                    onChange={handleInputChange}
                    placeholder="Batch Number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
                    <Input
                      id="manufacturingDate"
                      name="manufacturingDate"
                      type="date"
                      value={newStock.manufacturingDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={newStock.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    name="supplier"
                    value={newStock.supplier}
                    onChange={handleInputChange}
                    placeholder="Supplier name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddStockOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStock}>
                  Add Stock
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="by-location" className="mb-6">
        <TabsList>
          <TabsTrigger value="by-location">By Location</TabsTrigger>
          <TabsTrigger value="by-product">By Product</TabsTrigger>
        </TabsList>

        <TabsContent value="by-location">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or SKU..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Warehouses" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse} value={warehouse}>
                        {warehouse}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="normal">Normal Stock</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("product")}>
                      <div className="flex items-center">
                        Product
                        {sortColumn === "product" && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("warehouse")}>
                      <div className="flex items-center">
                        Warehouse
                        {sortColumn === "warehouse" && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => handleSort("quantity")}>
                      <div className="flex items-center justify-end">
                        Quantity
                        {sortColumn === "quantity" && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Allocated</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => handleSort("value")}>
                      <div className="flex items-center justify-end">
                        Value
                        {sortColumn === "value" && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStock.length > 0 ? (
                    filteredStock.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell>{item.product.sku}</TableCell>
                        <TableCell>{item.warehouse}</TableCell>
                        <TableCell className="text-right font-medium">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.allocatedQuantity}
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          {item.quantity <= item.threshold ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.value.retailPrice * item.quantity, item.value.currency)}
                        </TableCell>
                        <TableCell>{formatDate(item.lastUpdated)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(item)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                        No stock items found with the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="by-product">
          <Card className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or SKU..."
                className="pl-8 max-w-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Total Quantity</TableHead>
                    <TableHead className="text-right">Allocated</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead>Stock Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productTotalsArray
                    .filter(item =>
                      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => {
                      const available = item.total - item.allocated;
                      const percentage = Math.min(Math.round((item.total / (item.threshold * 2)) * 100), 100);
                      const isLow = item.total <= item.threshold;

                      return (
                        <TableRow key={item.sku}>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell className="text-right font-medium">
                            {item.total}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.allocated}
                          </TableCell>
                          <TableCell className="text-right">
                            {available}
                          </TableCell>
                          <TableCell>{item.unit}s</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.totalValue, item.currency)}
                          </TableCell>
                          <TableCell className="w-[200px]">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={percentage}
                                className={`h-2 ${isLow ? "bg-red-100" : "bg-green-100"}`}
                              />
                              <span className={isLow ? "text-red-500 text-sm" : "text-green-500 text-sm"}>
                                {percentage}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>Stock Details</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Product Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{selectedItem.product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span>{selectedItem.product.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Warehouse:</span>
                      <span>{selectedItem.warehouse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{selectedItem.locationInWarehouse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{formatDate(selectedItem.lastUpdated)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-3">Quantity Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Quantity:</span>
                      <span className="font-medium">{selectedItem.quantity} {selectedItem.unit}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allocated Quantity:</span>
                      <span>{selectedItem.allocatedQuantity} {selectedItem.unit}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available Quantity:</span>
                      <span>{selectedItem.quantity - selectedItem.allocatedQuantity} {selectedItem.unit}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Threshold:</span>
                      <span>{selectedItem.threshold} {selectedItem.unit}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>
                        {selectedItem.quantity <= selectedItem.threshold ? (
                          <Badge variant="destructive">Low Stock</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50">Normal</Badge>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Batch Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Batch Number:</span>
                      <span>{selectedItem.batchInfo.batchNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manufacturing Date:</span>
                      <span>{formatDate(selectedItem.batchInfo.manufacturingDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expiry Date:</span>
                      <span>{formatDate(selectedItem.batchInfo.expiryDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span>{selectedItem.batchInfo.supplier}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-3">Value Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost Price (per unit):</span>
                      <span>{formatCurrency(selectedItem.value.costPrice, selectedItem.value.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Retail Price (per unit):</span>
                      <span>{formatCurrency(selectedItem.value.retailPrice, selectedItem.value.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Cost Value:</span>
                      <span className="font-medium">{formatCurrency(selectedItem.value.costPrice * selectedItem.quantity, selectedItem.value.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Retail Value:</span>
                      <span className="font-medium">{formatCurrency(selectedItem.value.retailPrice * selectedItem.quantity, selectedItem.value.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Potential Profit:</span>
                      <span className="text-green-600 font-medium">
                        {formatCurrency((selectedItem.value.retailPrice - selectedItem.value.costPrice) * selectedItem.quantity, selectedItem.value.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
                  Close
                </Button>
                <Button>
                  Edit Stock
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Stock;