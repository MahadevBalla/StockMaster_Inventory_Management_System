export interface Movement {
  _id: string;
  type: 'Incoming' | 'Outgoing' | 'Transfer';
  product: string | Product;
  fromWarehouse?: string | Warehouse;
  toWarehouse?: string | Warehouse;
  quantity: number;
  reference?: string;
  initiatedBy: string | User;
  metadata?: any; // Mixed type
  reversalOf?: string | Movement;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  _id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit: 'piece' | 'kg' | 'liter' | 'box';
  barcode?: string;
  minStockLevel?: number;
  isPerishable?: boolean;
  defaultExpiryDays?: number;
  attributes?: any; // Mixed type
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  _id: string;
  name: string;
  type: 'inventory-valuation' | 'stock-movement' | 'slow-moving' | 'fast-moving' | 'expiry' | 'custom';
  createdBy: string | User;
  filters?: any; // Mixed type
  data?: any; // Mixed type for cached results
  format: 'csv' | 'pdf' | 'json';
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  _id: string;
  type: 'low-stock' | 'expiry' | 'theft' | 'discrepancy';
  product: string | Product;
  warehouse?: string | Warehouse;
  threshold?: number;
  currentValue?: number;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string | User;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  _id: string;
  product: {
    name: string;
    sku: string;
  };
  warehouse: string;
  quantity: {
    value: number;
    unit: string;
    threshold: number;
  };
  allocatedQuantity: number;
  status: 'normal' | 'low' | 'out-of-stock';
  lastUpdated: Date;
  batchInfo?: {
    batchNumber?: string;
    expiryDate?: Date;
    manufacturingDate?: Date;
    supplier?: string;
  };
  locationInWarehouse?: string;
  value?: {
    costPrice?: number;
    retailPrice?: number;
    currency?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'staff';
  warehouses: string[] | Warehouse[];
  isActive: boolean;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Method types
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

export interface Warehouse {
  _id: string;
  name: string;
  location?: {
    address?: string;
    city?: string;
    postalCode?: string;
  };
  capacity?: number;
  currentOccupancy?: number;
  manager?: string | User;
  createdAt: Date;
  updatedAt: Date;
}

export interface TopBarProps {
  user: User;
}