
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight, ArrowUp, Package } from "lucide-react";

// Activity types
type ActivityType = "Incoming" | "Outgoing" | "Transfer";
// Activity interface
export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  user: string;
  quantity: number;
  item: string;
  location: string;
  destination?: string;
}

// Props interface
interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

// Activity icon mapping
const ActivityIcon = ({ type }: { type: ActivityType }) => {
  switch (type) {
    case "Incoming":
      return <ArrowDown className="h-4 w-4 text-green-500" />;
    case "Outgoing":
      return <ArrowUp className="h-4 w-4 text-red-500" />;
    case "Transfer":
      return <ArrowRight className="h-4 w-4 text-blue-500" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

// Activity type to text mapping
const getActivityTitle = (type: ActivityType): string => {
  switch (type) {
    case "Incoming":
      return "Purchase";
    case "Outgoing":
      return "Sale";
    case "Transfer":
      return "Transfer";
    default:
      return "Activity";
  }
};

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <div className={cn("data-card", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Activity Feed</h3>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {activities.map((activity) => (
          <div key={activity.id} className="flex group animate-fade-in">
            <div className="mr-4 flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <ActivityIcon type={activity.type} />
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">
                  {getActivityTitle(activity.type)}
                </div>
                <div className="text-muted-foreground text-xs">
                  {activity.timestamp}
                </div>
              </div>

              <p className="text-sm">{activity.description}</p>

              <div className="flex items-center text-xs text-muted-foreground">
                <span>{activity.user}</span>
                <span className="mx-1">•</span>
                <span>{activity.quantity} {activity.item}</span>
                <span className="mx-1">•</span>
                <span>{activity.location}</span>
                {activity.destination && (
                  <>
                    <span className="mx-1">→</span>
                    <span>{activity.destination}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
