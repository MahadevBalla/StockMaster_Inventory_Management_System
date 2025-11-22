
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WarehouseData {
  id: string;
  name: string;
  capacity: number;
  usedCapacity: number;
  itemCount: number;
  location: string;
}

interface WarehouseSummaryProps {
  warehouses: WarehouseData[];
  className?: string;
}

export function WarehouseSummary({ warehouses, className }: WarehouseSummaryProps) {
  return (
    <div className={cn(className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Warehouse Summary</h3>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((warehouse) => {
          const usagePercentage = Math.round((warehouse.usedCapacity / warehouse.capacity) * 100);
          
          let statusColor = "text-green-500";
          if (usagePercentage > 90) {
            statusColor = "text-red-500";
          } else if (usagePercentage > 70) {
            statusColor = "text-yellow-500";
          }
          
          return (
            <Card key={warehouse.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {warehouse.name}
                  <Circle className={cn("h-3 w-3 fill-current", statusColor)} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-1">
                  {warehouse.location}
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Storage Usage</span>
                    <span className="font-medium">{usagePercentage}%</span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{warehouse.itemCount}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{warehouse.usedCapacity} / {warehouse.capacity} units</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
