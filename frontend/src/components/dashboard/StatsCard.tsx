
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn("data-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="data-card-title">{title}</p>
          <h3 className="data-card-value">{value}</h3>
        </div>
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="data-card-footer flex items-center">
          <span className={cn("mr-1", trend.positive ? "text-green-500" : "text-red-500")}>
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
