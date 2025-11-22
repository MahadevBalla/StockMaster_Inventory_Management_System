
import React from 'react';
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StockThresholdProps {
  currentStock: number;
  maxThreshold: number;
  productName: string;
}

export const StockThreshold = ({ currentStock, maxThreshold, productName }: StockThresholdProps) => {
  const isOverstocked = currentStock > maxThreshold;
  const overstockPercentage = ((currentStock - maxThreshold) / maxThreshold) * 100;

  return isOverstocked ? (
    <Card className="p-4 bg-amber-50">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <div className="flex-1">
          <p className="text-sm font-medium">{productName}</p>
          <p className="text-xs text-muted-foreground">
            Overstock alert: {currentStock} units (Max: {maxThreshold})
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-100">
          +{overstockPercentage.toFixed(0)}%
        </Badge>
      </div>
    </Card>
  ) : null;
};
