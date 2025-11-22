
// Mock data for the dashboard

// Stock stats
export const stockStats = [
  {
    title: "Total SKUs",
    value: 1247,
    trend: { value: 12, label: "from last month", positive: true },
  },
  {
    title: "Total Stock Value",
    value: "$682,945",
    trend: { value: 8.2, label: "from last month", positive: true },
  },
  {
    title: "Low Stock Items",
    value: 13,
    trend: { value: 2, label: "from last week", positive: false },
  },
  {
    title: "Pending Transfers",
    value: 8,
    trend: { value: 0, label: "no change", positive: true },
  },
];

// Activity feed data
export const activityFeed = [
  {
    id: "act-1",
    type: "purchase" as const,
    description: "Received new shipment of widgets",
    timestamp: "10 minutes ago",
    user: "John Doe",
    quantity: 200,
    item: "Blue Widgets",
    location: "Warehouse A",
  },
  {
    id: "act-2",
    type: "sale" as const,
    description: "Fulfilled order #10284",
    timestamp: "1 hour ago",
    user: "Sarah Chen",
    quantity: 50,
    item: "Red Gadgets",
    location: "Warehouse B",
  },
  {
    id: "act-3",
    type: "transfer" as const,
    description: "Transferred items between warehouses",
    timestamp: "3 hours ago",
    user: "Mike Johnson",
    quantity: 75,
    item: "Green Widgets",
    location: "Warehouse A",
    destination: "Warehouse C",
  },
  {
    id: "act-4",
    type: "purchase" as const,
    description: "Received shipment from Acme Co.",
    timestamp: "Yesterday, 2:30 PM",
    user: "Lisa Wong",
    quantity: 150,
    item: "Yellow Gadgets",
    location: "Warehouse B",
  },
  {
    id: "act-5",
    type: "sale" as const,
    description: "Fulfilled order #10285",
    timestamp: "Yesterday, 10:15 AM",
    user: "Alex Smith",
    quantity: 25,
    item: "Purple Widgets",
    location: "Warehouse A",
  },
  {
    id: "act-6",
    type: "transfer" as const,
    description: "Rebalanced inventory",
    timestamp: "2 days ago",
    user: "John Doe",
    quantity: 100,
    item: "Blue Gadgets",
    location: "Warehouse C",
    destination: "Warehouse A",
  },
];

// Stock level chart data
export const stockLevelData = [
  {
    date: "Jan",
    warehouse1: 400,
    warehouse2: 240,
    warehouse3: 180,
  },
  {
    date: "Feb",
    warehouse1: 450,
    warehouse2: 260,
    warehouse3: 198,
  },
  {
    date: "Mar",
    warehouse1: 520,
    warehouse2: 320,
    warehouse3: 210,
  },
  {
    date: "Apr",
    warehouse1: 490,
    warehouse2: 280,
    warehouse3: 190,
  },
  {
    date: "May",
    warehouse1: 540,
    warehouse2: 350,
    warehouse3: 230,
  },
  {
    date: "Jun",
    warehouse1: 580,
    warehouse2: 390,
    warehouse3: 250,
  },
  {
    date: "Jul",
    warehouse1: 610,
    warehouse2: 410,
    warehouse3: 280,
  },
];

// Inventory alerts
export const inventoryAlerts = [
  {
    id: "alert-1",
    type: "low_stock" as const,
    item: "Blue Widgets (SKU: BW-1001)",
    quantity: 8,
    threshold: 25,
    location: "Warehouse A",
  },
  {
    id: "alert-2",
    type: "low_stock" as const,
    item: "Red Gadgets (SKU: RG-2002)",
    quantity: 5,
    threshold: 20,
    location: "Warehouse B",
  },
  {
    id: "alert-3",
    type: "expiry" as const,
    item: "Perishable Items (SKU: PI-3003)",
    expiryDate: "May 15, 2025",
    daysRemaining: 5,
    location: "Warehouse A",
  },
  {
    id: "alert-4",
    type: "expiry" as const,
    item: "Medical Supplies (SKU: MS-4004)",
    expiryDate: "Jun 20, 2025",
    daysRemaining: 41,
    location: "Warehouse C",
  },
  {
    id: "alert-5",
    type: "low_stock" as const,
    item: "Electronic Components (SKU: EC-5005)",
    quantity: 12,
    threshold: 50,
    location: "Warehouse B",
  },
];

// Warehouse data
export const warehouseData = [
  {
    id: "wh-1",
    name: "Warehouse A",
    capacity: 1000,
    usedCapacity: 750,
    itemCount: 152,
    location: "Boston, MA",
  },
  {
    id: "wh-2",
    name: "Warehouse B",
    capacity: 800,
    usedCapacity: 620,
    itemCount: 98,
    location: "Chicago, IL",
  },
  {
    id: "wh-3",
    name: "Warehouse C",
    capacity: 1200,
    usedCapacity: 1140,
    itemCount: 215,
    location: "Austin, TX",
  },
];

// Top selling products
export const topProducts = [
  {
    id: "prod-1",
    name: "Blue Widgets",
    sku: "BW-1001",
    sales: 1245,
    revenue: 24900,
    growth: 12.5,
  },
  {
    id: "prod-2",
    name: "Red Gadgets",
    sku: "RG-2002",
    sales: 986,
    revenue: 19720,
    growth: 8.3,
  },
  {
    id: "prod-3",
    name: "Green Widgets",
    sku: "GW-3003",
    sales: 754,
    revenue: 15080,
    growth: -2.1,
  },
  {
    id: "prod-4",
    name: "Yellow Gadgets",
    sku: "YG-4004",
    sales: 652,
    revenue: 13040,
    growth: 5.4,
  },
  {
    id: "prod-5",
    name: "Purple Widgets",
    sku: "PW-5005",
    sales: 541,
    revenue: 10820,
    growth: 15.2,
  },
];
