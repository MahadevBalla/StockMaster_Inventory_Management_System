import { useState, useEffect } from "react";
import { Plus, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Warehouse } from "@/types";
import { cn } from "@/lib/utils";

// Define your API base URL - adjust this to match your setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Warehouses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Form state for new warehouse
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    location: {
      address: "",
      city: "",
      postalCode: ""
    },
    capacity: 1000,
    currentOccupancy: 0
  });

  // Fetch warehouses from the backend API
  useEffect(() => {
    const fetchWarehouses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/warehouse`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies if your API uses authentication
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Failed to fetch warehouses: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        setWarehouses(data.data || []);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        toast({
          title: "Error",
          description: "Failed to load warehouses. Please try again later.",
          variant: "destructive"
        });
        // Set empty array to avoid null reference errors in the UI
        setWarehouses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarehouses();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle nested location object
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewWarehouse(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }));
    } else {
      setNewWarehouse({
        ...newWarehouse,
        [name]: name === "capacity" || name === "currentOccupancy" ? parseInt(value) || 0 : value
      });
    }
  };

  const handleAddWarehouse = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/warehouse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies if your API uses authentication
        body: JSON.stringify(newWarehouse),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to add warehouse: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Add the new warehouse to the list
      setWarehouses(prevWarehouses => [...prevWarehouses, result.data]);

      toast({
        title: "Warehouse Added",
        description: `${newWarehouse.name} has been added to your locations.`,
      });

      setIsAddWarehouseOpen(false);
      // Reset form
      setNewWarehouse({
        name: "",
        location: {
          address: "",
          city: "",
          postalCode: ""
        },
        capacity: 1000,
        currentOccupancy: 0
      });
    } catch (error) {
      console.error('Error adding warehouse:', error);
      toast({
        title: "Error",
        description: "Failed to add warehouse. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter warehouses based on search query
  const filteredWarehouses = warehouses.filter((warehouse) => {
    const warehouseName = warehouse.name?.toLowerCase() || "";
    const warehouseCity = warehouse.location?.city?.toLowerCase() || "";
    const searchQueryLower = searchQuery.toLowerCase();

    return warehouseName.includes(searchQueryLower) || warehouseCity.includes(searchQueryLower);
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">
            Manage warehouse locations and capacity
          </p>
        </div>
        <div>
          <Dialog open={isAddWarehouseOpen} onOpenChange={setIsAddWarehouseOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Warehouse
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Warehouse</DialogTitle>
                <DialogDescription>
                  Add a new warehouse location to your inventory system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Warehouse Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newWarehouse.name}
                    onChange={handleInputChange}
                    placeholder="E.g., Warehouse D"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location.address">Address</Label>
                  <Input
                    id="location.address"
                    name="location.address"
                    value={newWarehouse.location.address}
                    onChange={handleInputChange}
                    placeholder="E.g., 123 Industrial Park"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="location.city">City</Label>
                    <Input
                      id="location.city"
                      name="location.city"
                      value={newWarehouse.location.city}
                      onChange={handleInputChange}
                      placeholder="E.g., Seattle"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location.postalCode">Postal Code</Label>
                    <Input
                      id="location.postalCode"
                      name="location.postalCode"
                      value={newWarehouse.location.postalCode}
                      onChange={handleInputChange}
                      placeholder="E.g., 98101"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="capacity">Storage Capacity (units)</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="100"
                      value={newWarehouse.capacity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentOccupancy">Current Occupancy (units)</Label>
                    <Input
                      id="currentOccupancy"
                      name="currentOccupancy"
                      type="number"
                      min="0"
                      max={newWarehouse.capacity}
                      value={newWarehouse.currentOccupancy}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddWarehouseOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWarehouse}>
                  Add Warehouse
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading warehouses...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {warehouses.length > 0 ? (
              warehouses.map((warehouse) => {
                const usagePercentage = warehouse.capacity && warehouse.currentOccupancy
                  ? Math.round((warehouse.currentOccupancy / warehouse.capacity) * 100)
                  : 0;

                let statusColor = "text-green-500";
                if (usagePercentage > 95) {
                  statusColor = "text-red-500";
                } else if (usagePercentage > 80) {
                  statusColor = "text-amber-500";
                }

                return (
                  <Card key={warehouse._id} className="relative overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        {warehouse.name}
                        <Badge variant={
                          usagePercentage > 95
                            ? "destructive"
                            : usagePercentage > 80
                              ? "default"
                              : "outline"
                        }>
                          {
                            usagePercentage > 95
                              ? "Critical"
                              : usagePercentage > 80
                                ? "Near Capacity"
                                : "Normal"
                          }
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        {warehouse.location ? (
                          <>
                            {warehouse.location.address && (
                              <span className="mr-1">{warehouse.location.address},</span>
                            )}
                            {warehouse.location.city || warehouse.location.postalCode ? (
                              <span>
                                {warehouse.location.city}
                                {warehouse.location.postalCode && ` ${warehouse.location.postalCode}`}
                              </span>
                            ) : (
                              !warehouse.location.address && <span>Location not specified</span>
                            )}
                          </>
                        ) : (
                          <span>Location not specified</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Storage Usage</span>
                            <span className={`font-medium ${statusColor}`}>{usagePercentage}%</span>
                          </div>
                          <Progress
                            value={usagePercentage}
                            className={cn(
                              "h-2",
                              usagePercentage > 95
                                ? "[--progress-foreground:theme(colors.red.500)]"
                                : usagePercentage > 80
                                  ? "[--progress-foreground:theme(colors.amber.500)]"
                                  : ""
                            )}
                          />
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Capacity</span>
                          <span className="font-medium">
                            {warehouse.currentOccupancy || 0} / {warehouse.capacity || 0} units
                          </span>
                        </div>

                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-10 text-muted-foreground">
                No warehouses found. Add your first warehouse to get started.
              </div>
            )}
          </div>

          <Card className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search warehouses..."
                className="pl-8 max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead>Manager</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.length > 0 ? (
                    filteredWarehouses.map((warehouse) => {
                      const occupancyPercentage = warehouse.capacity && warehouse.capacity > 0
                        ? Math.round(((warehouse.currentOccupancy || 0) / warehouse.capacity) * 100)
                        : 0;

                      return (
                        <TableRow key={warehouse._id}>
                          <TableCell className="font-medium">{warehouse.name}</TableCell>
                          <TableCell>
                            {warehouse.location?.address && `${warehouse.location.address}, `}
                            {warehouse.location?.city && `${warehouse.location.city}, `}
                            {warehouse.location?.postalCode || ''}
                          </TableCell>
                          <TableCell>{warehouse.capacity || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={occupancyPercentage}
                                className={cn(
                                  "h-2 w-20",
                                  occupancyPercentage > 95
                                    ? "[--progress-foreground:theme(colors.red.500)]"
                                    : occupancyPercentage > 80
                                      ? "[--progress-foreground:theme(colors.amber.500)]"
                                      : ""
                                )}
                              />
                              <span className="text-xs">{occupancyPercentage}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {warehouse.manager && typeof warehouse.manager === 'object'
                              ? (warehouse.manager as any).name || 'No name'
                              : 'Unassigned'}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No warehouses found with the current search query.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default Warehouses;