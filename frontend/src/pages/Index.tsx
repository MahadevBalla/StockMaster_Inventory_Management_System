
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart,
  Layers,
  Package,
  TrendingUp,
  Truck,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StockLevelChart } from "@/components/dashboard/StockLevelChart";
import { InventoryAlerts } from "@/components/dashboard/InventoryAlerts";
import { WarehouseSummary } from "@/components/dashboard/WarehouseSummary";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Data for the category distribution chart
const categoryData = [
  { name: "Electronics", value: 40 },
  { name: "Office Supplies", value: 30 },
  { name: "Furniture", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Mock data for top products
const topProducts = [
  { id: 1, name: "Product A", sku: "SKU123", sales: 120, growth: 10 },
  { id: 2, name: "Product B", sku: "SKU456", sales: 95, growth: 5 },
  { id: 3, name: "Product C", sku: "SKU789", sales: 80, growth: -3 },
  { id: 4, name: "Product D", sku: "SKU012", sales: 60, growth: 8 },
  { id: 5, name: "Product E", sku: "SKU345", sales: 50, growth: -2 },
];

// Mock data for warehouse summary
const warehouseData = [
  { id: "wh-1", name: "Warehouse A", stock: 500, location: "New York", capacity: 1000, usedCapacity: 500, itemCount: 200 },
  { id: "wh-2", name: "Warehouse B", stock: 300, location: "Los Angeles", capacity: 800, usedCapacity: 300, itemCount: 150 },
  { id: "wh-3", name: "Warehouse C", stock: 400, location: "Chicago", capacity: 900, usedCapacity: 400, itemCount: 180 },
];

// Mock data for inventory alerts
const inventoryAlerts = [
  { id: "1", message: "Low stock for Product A", severity: "high", type: "low_stock" as const, item: "Product A", location: "Warehouse A" },
  { id: "2", message: "Product B nearing expiration", severity: "medium", type: "expiry" as const, item: "Product B", location: "Warehouse B" },
  { id: "3", message: "Stock discrepancy in Warehouse C", severity: "low", type: "low_stock" as const, item: "Warehouse C", location: "Warehouse C" },
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");

  const base = import.meta.env.VITE_API_BASE_URL || "";

  // Data from backend
  const [products, setProducts] = useState<any[]>([]);
  const [inventories, setInventories] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  const pollingRef = useRef<number | null>(null);

  // Fetch helpers
  async function fetchProducts() {
    try {
      const res = await fetch(`${base}/products?limit=1000`);
      const data = await res.json();
      // productController returns { products, totalPages, currentPage }
      setProducts(data.products || data || []);
    } catch (err) {
      console.error("Failed fetching products", err);
    }
  }

  async function fetchInventories() {
    try {
      const res = await fetch(`${base}/inventory`);
      const json = await res.json();
      // inventory.controller returns { message, inventories }
      setInventories(json.inventories || json || []);
    } catch (err) {
      console.error("Failed fetching inventories", err);
    }
  }

  async function fetchMovements() {
    try {
      const res = await fetch(`${base}/movements`);
      const json = await res.json();
      setMovements(Array.isArray(json) ? json : json.movements || []);
    } catch (err) {
      console.error("Failed fetching movements", err);
    }
  }

  async function fetchAlerts() {
    try {
      const res = await fetch(`${base}/alerts`);
      const json = await res.json();
      // alerts controller wraps in ApiResponse { data }
      setAlerts(json.data || json || []);
    } catch (err) {
      console.error("Failed fetching alerts", err);
    }
  }

  async function fetchWarehouses() {
    try {
      const res = await fetch(`${base}/warehouse`);
      const json = await res.json();
      setWarehouses(json.data || json || []);
    } catch (err) {
      console.error("Failed fetching warehouses", err);
    }
  }

  async function fetchAll() {
    await Promise.all([fetchProducts(), fetchInventories(), fetchMovements(), fetchAlerts(), fetchWarehouses()]);
  }

  useEffect(() => {
    fetchAll();

    // Poll every 15 seconds for near-real-time updates
    pollingRef.current = window.setInterval(() => {
      fetchAll();
    }, 15000);

    return () => {
      if (pollingRef.current) window.clearInterval(pollingRef.current);
    };
  }, []);

  // Icons for the stats cards
  const statsIcons = [
    <Package className="h-5 w-5" />,
    <TrendingUp className="h-5 w-5" />,
    <ArrowDownRight className="h-5 w-5" />,
    <Truck className="h-5 w-5" />,
  ];

  // compute dashboard statistics from live data
  const computedStockStats = (() => {
    const totalStock = inventories.reduce((s, inv) => s + (inv.quantity || 0), 0);
    const totalStockValue = inventories.reduce((s, inv) => {
      const price = inv.value?.costPrice || inv.value?.retailPrice || 0;
      return s + (price * (inv.quantity || 0));
    }, 0);
    const lowStockCount = alerts.filter((a: any) => a.type === "low-stock").length;
    const pendingTransfers = movements.filter((m: any) => (m.status || "").toLowerCase() === "pending").length;

    return [
      { title: "Total Stock", value: totalStock.toLocaleString(), trend: { value: 0, label: "", positive: true } },
      { title: "Stock Value", value: `$${Math.round(totalStockValue).toLocaleString()}`, trend: { value: 0, label: "", positive: true } },
      { title: "Low Stock Items", value: lowStockCount.toString(), trend: { value: 0, label: "", positive: false } },
      { title: "Pending Transfers", value: pendingTransfers.toString(), trend: { value: 0, label: "", positive: false } },
    ];
  })();

  // Mock data for stock level chart
  const stockLevelData = [
    { name: "Jan", stock: 400, date: "2023-01-01", warehouse1: 200 },
    { name: "Feb", stock: 300, date: "2023-02-01", warehouse1: 150 },
    { name: "Mar", stock: 500, date: "2023-03-01", warehouse1: 250 },
    { name: "Apr", stock: 700, date: "2023-04-01", warehouse1: 350 },
    { name: "May", stock: 600, date: "2023-05-01", warehouse1: 300 },
  ];

  const activityFeed: Activity[] = [
    { id: "1", description: "Stock updated for Product A", timestamp: "2023-05-01 10:00 AM", type: "Incoming", user: "Admin", quantity: 50, item: "Product A", location: "Warehouse A" },
    { id: "2", description: "New order placed for Product B", timestamp: "2023-05-02 11:30 AM", type: "Outgoing", user: "Customer", quantity: 20, item: "Product B", location: "Online" },
    { id: "3", description: "Delivery completed for Order #1234", timestamp: "2023-05-03 02:15 PM", type: "Outgoing", user: "Courier", quantity: 30, item: "Order #1234", location: "Warehouse B" },
    { id: "4", description: "Return processed for Product C", timestamp: "2023-05-04 04:45 PM", type: "Incoming", user: "Customer", quantity: 10, item: "Product C", location: "Warehouse C" },
  ];

  const handleExportReport = () => {
    // In a real app, this would generate and download a PDF report
    console.log("Exporting index report");
  };

  // Derived (computed) data used for UI (fall back to mocks if empty)
  const computedCategoryData = (() => {
    if (products && products.length) {
      const map: Record<string, number> = {};
      for (const p of products) {
        const cat = p.category || "Other";
        const qty = typeof p.stock === "number" ? p.stock : 0;
        map[cat] = (map[cat] || 0) + qty;
      }
      return Object.entries(map).map(([name, value], i) => ({ name, value }));
    }
    return categoryData;
  })();

  const computedTopProducts = (() => {
    if (products && products.length) {
      return products
        .slice()
        .sort((a, b) => (b.stock || 0) - (a.stock || 0))
        .slice(0, 5)
        .map((p: any) => ({ id: p._id || p.id, name: p.name, sku: p.sku || "", sales: p.stock || 0, growth: 0 }));
    }
    return topProducts;
  })();

  const computedWarehouseData = (() => {
    if (warehouses && warehouses.length) {
      // sum inventory per warehouse
      const invMap: Record<string, { stock: number; itemCount: number }> = {};
      for (const inv of inventories) {
        const wh = inv.warehouse?.name || inv.warehouse || "unknown";
        invMap[wh] = invMap[wh] || { stock: 0, itemCount: 0 };
        invMap[wh].stock += inv.quantity || 0;
        invMap[wh].itemCount += 1;
      }

      return warehouses.map((w: any) => {
        let loc = "";
        if (w.location) {
          if (typeof w.location === "string") loc = w.location;
          else if (typeof w.location === "object") {
            const parts = [];
            if (w.location.address) parts.push(w.location.address);
            if (w.location.city) parts.push(w.location.city);
            if (w.location.postalCode) parts.push(w.location.postalCode);
            loc = parts.join(", ");
          }
        }

        return {
          id: w._id || w.id,
          name: w.name,
          stock: invMap[w.name]?.stock || 0,
          location: loc,
          capacity: w.capacity || 0,
          usedCapacity: w.currentOccupancy || invMap[w.name]?.stock || 0,
          itemCount: invMap[w.name]?.itemCount || 0,
        };
      });
    }
    return warehouseData;
  })();

  const computedAlerts = (alerts && alerts.length) ? alerts : inventoryAlerts;

  const computedStockLevelData = (() => {
    if (movements && movements.length) {
      // aggregate by month name
      const map: Record<string, number> = {};
      for (const m of movements) {
        const date = new Date(m.createdAt || Date.now());
        const month = date.toLocaleString("en-US", { month: "short" });
        const qty = Number(m.quantity || 0);
        const t = (m.type || "").toLowerCase();
        const isIncoming = ["incoming", "in", "receipt", "restock"].some(x => t.includes(x));
        map[month] = (map[month] || 0) + (isIncoming ? qty : -qty);
      }
      return Object.entries(map).map(([month, value]) => ({ name: month, stock: value, date: "", warehouse1: 0 }));
    }
    return stockLevelData;
  })();

  const computedActivityFeed = (() => {
    if (movements && movements.length) {
      return movements.slice(0, 10).map((m: any) => ({
        id: m._id,
        description: `${m.type || "Movement"} for ${m.product?.name || m.product || "item"}`,
        timestamp: new Date(m.createdAt).toLocaleString(),
        type: m.type || "",
        user: m.initiatedBy?.username || m.initiatedBy || "system",
        quantity: m.quantity,
        item: m.product?.name || m.product,
        location: m.fromWarehouse?.name || m.toWarehouse?.name || "",
      }));
    }
    return activityFeed;
  })();

  // Expiry stats
  const expiryStats = (() => {
    if (!inventories || inventories.length === 0) return { exp7: 0, exp30: 0, total: 0 };
    const now = new Date();
    let exp7 = 0;
    let exp30 = 0;
    let total = 0;
    for (const inv of inventories) {
      const dateStr = inv.batchInfo?.expiryDate || inv.expiryDate || null;
      if (!dateStr) continue;
      const d = new Date(dateStr);
      const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      total++;
      if (diff <= 7 && diff > 0) exp7++;
      if (diff <= 30 && diff > 0) exp30++;
    }
    return { exp7, exp30, total };
  })();

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to StockMaster - your inventory management hub
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {computedStockStats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={statsIcons[index]}
            trend={stat.trend}
          />
        ))}
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts and Activity Feed */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StockLevelChart
              data={computedStockLevelData}
              className="lg:col-span-2"
            />

            <InventoryAlerts
              alerts={computedAlerts}
              className="h-full"
            />
            {/* <ActivityFeed
              activities={activityFeed.slice(0, 4)}
            /> */}
          </div>

          {/* Inventory Summary Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Category Distribution</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                            data={computedCategoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {computedCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3">Top Products</h3>
                  <div className="space-y-3">
                    {computedTopProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.sku}</div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{product.sales}</span>
                          <span className={`text-xs ${product.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {product.growth > 0 ? '+' : ''}{product.growth}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warehouse Summary */}
          <WarehouseSummary warehouses={computedWarehouseData} />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          {/* Inventory Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span>Inventory Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryAlerts alerts={computedAlerts} />
            </CardContent>
          </Card>

          {/* Expiry Calendar */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Upcoming Expirations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-amber-800">Expiring in 7 days</div>
                      <div className="text-2xl font-bold mt-1">{expiryStats.exp7} items</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-orange-800">Expiring in 30 days</div>
                      <div className="text-2xl font-bold mt-1">{expiryStats.exp30} items</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-blue-800">Total with expiry date</div>
                      <div className="text-2xl font-bold mt-1">{expiryStats.total} items</div>
                    </CardContent>
                  </Card>
                </div>
                <Button variant="outline" className="w-full">View All Expiring Items</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <ActivityFeed activities={activityFeed} /> */}
              <Button variant="outline" className="w-full mt-4">View All Activity</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Dashboard;
