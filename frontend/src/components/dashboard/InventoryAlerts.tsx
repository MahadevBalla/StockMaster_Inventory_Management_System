
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, Calendar } from "lucide-react";

interface AlertItem {
  id: string;
  type: "low_stock" | "expiry";
  item: string;
  quantity?: number;
  threshold?: number;
  expiryDate?: string;
  daysRemaining?: number;
  location: string;
}

interface InventoryAlertsProps {
  alerts: AlertItem[];
  className?: string;
}

export function InventoryAlerts({ alerts, className }: InventoryAlertsProps) {
  // Group alerts by type
  const lowStockAlerts = alerts.filter(alert => alert.type === "low_stock");
  const expiryAlerts = alerts.filter(alert => alert.type === "expiry");

  return (
    <div className={cn("data-card", className)}>
      <h3 className="text-lg font-medium mb-4">Inventory Alerts</h3>
      
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mb-2 opacity-20" />
          <p>No alerts at the moment</p>
        </div>
      ) : (
        <div className="space-y-6">
          {lowStockAlerts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium flex items-center mb-3">
                <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                Low Stock Items
              </h4>
              <div className="space-y-2">
                {lowStockAlerts.map(alert => (
                  <div 
                    key={alert.id}
                    className="bg-destructive/5 p-3 rounded-md border border-destructive/10"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{alert.item}</p>
                        <p className="text-sm text-muted-foreground">{alert.location}</p>
                      </div>
                      <div className="badge badge-danger">
                        {alert.quantity} / {alert.threshold}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {expiryAlerts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium flex items-center mb-3">
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                Approaching Expiry
              </h4>
              <div className="space-y-2">
                {expiryAlerts.map(alert => (
                  <div 
                    key={alert.id}
                    className={cn(
                      "p-3 rounded-md border",
                      alert.daysRemaining && alert.daysRemaining <= 7 
                        ? "bg-destructive/5 border-destructive/10" 
                        : "bg-yellow-50/50 border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/20"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{alert.item}</p>
                        <p className="text-sm text-muted-foreground">{alert.location}</p>
                      </div>
                      <div className={cn(
                        "badge",
                        alert.daysRemaining && alert.daysRemaining <= 7 
                          ? "badge-danger"
                          : "badge-warning"
                      )}>
                        <Calendar className="mr-1 h-3 w-3" />
                        {alert.expiryDate}
                      </div>
                    </div>
                    {alert.daysRemaining && (
                      <p className="text-xs mt-1 text-muted-foreground">
                        Expires in {alert.daysRemaining} days
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
