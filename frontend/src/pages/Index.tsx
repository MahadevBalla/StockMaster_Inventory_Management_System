
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
import { useState } from "react";
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

  // Icons for the stats cards
  const statsIcons = [
    <Package className="h-5 w-5" />,
    <TrendingUp className="h-5 w-5" />,
    <ArrowDownRight className="h-5 w-5" />,
    <Truck className="h-5 w-5" />,
  ];

  const stockStats = [
    { title: "Total Stock", value: "1,200", trend: { value: 10, label: "Increase", positive: true } },
    { title: "Sales", value: "800", trend: { value: 15, label: "Increase", positive: true } },
    { title: "Returns", value: "50", trend: { value: 5, label: "Decrease", positive: false } },
    { title: "Deliveries", value: "1,000", trend: { value: 20, label: "Increase", positive: true } },
  ];

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
    console.log("Exporting dashboard report");
  };

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
        {stockStats.map((stat, index) => (
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
              data={stockLevelData}
              className="lg:col-span-2"
            />

            <InventoryAlerts
              alerts={inventoryAlerts}
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
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {categoryData.map((entry, index) => (
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
                    {topProducts.slice(0, 5).map((product) => (
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
          <WarehouseSummary warehouses={warehouseData} />
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
              <InventoryAlerts alerts={inventoryAlerts} />
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
                      <div className="text-2xl font-bold mt-1">5 items</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-orange-800">Expiring in 30 days</div>
                      <div className="text-2xl font-bold mt-1">12 items</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-blue-800">Total with expiry date</div>
                      <div className="text-2xl font-bold mt-1">83 items</div>
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
