
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface StockData {
  date: string;
  warehouse1: number;
  warehouse2?: number;
  warehouse3?: number;
}

interface StockLevelChartProps {
  data: StockData[];
  className?: string;
}

export function StockLevelChart({ data, className }: StockLevelChartProps) {
  return (
    <div className={cn("data-card", className)}>
      <h3 className="text-lg font-medium mb-4">Stock Levels Over Time</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs fill-muted-foreground"
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ fontSize: '12px' }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '10px',
                fontSize: '12px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="warehouse1" 
              name="Warehouse A"
              stroke="hsl(var(--primary))" 
              activeDot={{ r: 6 }} 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="warehouse2" 
              name="Warehouse B"
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="warehouse3" 
              name="Warehouse C"
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
