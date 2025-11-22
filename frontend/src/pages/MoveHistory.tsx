import { useState, useEffect } from "react";
import { ArrowRightLeft, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MoveHistory = () => {
    const [movements, setMovements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLogMoveOpen, setIsLogMoveOpen] = useState(false);
    const { toast } = useToast();

    const [transferScope, setTransferScope] = useState("inter_warehouse");

    // Form State
    const [formData, setFormData] = useState({
        type: "Transfer",
        product: "",
        quantity: "",
        fromWarehouse: "",
        toWarehouse: "",
        fromLocation: "",
        toLocation: ""
    });

    // Data for dropdowns
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        fetchMovements();
        fetchDropdownData();
    }, []);

    const fetchMovements = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/movements`);
            if (!response.ok) throw new Error("Failed to fetch movements");
            const data = await response.json();
            setMovements(data);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load history", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const whRes = await fetch(`${API_BASE_URL}/warehouse`);
            const whData = await whRes.json();
            setWarehouses(whData.data || []);
        } catch (e) {
            console.error("Failed to load warehouses", e);
        }
    };

    const fetchProductsForWarehouse = async (warehouseId) => {
        if (!warehouseId) {
            setProducts([]);
            return;
        }

        try {
            // Fetch inventory for the selected warehouse
            const invRes = await fetch(`${API_BASE_URL}/inventory`);
            const invData = await invRes.json();

            console.log("All inventory:", invData.inventories);
            console.log("Selected warehouse ID:", warehouseId);

            // Filter inventory by warehouse and extract unique products
            // Convert both to strings for comparison since they might be ObjectIds
            const warehouseInventory = invData.inventories?.filter(
                inv => {
                    const invWarehouseId = typeof inv.warehouse === 'object' ? inv.warehouse._id : inv.warehouse;
                    const match = String(invWarehouseId) === String(warehouseId) && inv.quantity > 0;
                    return match;
                }
            ) || [];

            console.log("Filtered warehouse inventory:", warehouseInventory);

            // Get unique product IDs
            const productIds = [...new Set(warehouseInventory.map(inv => {
                // Handle both populated and non-populated product references
                return typeof inv.product === 'object' ? inv.product._id : inv.product;
            }))];

            console.log("Product IDs in warehouse:", productIds);

            // Fetch all products
            const prodRes = await fetch(`${API_BASE_URL}/products`);
            const prodData = await prodRes.json();
            const allProducts = prodData.products || [];

            console.log("All products from API:", allProducts);

            // Filter products that exist in this warehouse's inventory
            const availableProducts = allProducts.filter(p =>
                productIds.some(id => String(id) === String(p._id))
            );

            console.log("Available products:", availableProducts);

            setProducts(availableProducts);
        } catch (e) {
            console.error("Failed to load products for warehouse", e);
            setProducts([]);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            console.log("Form data on submit:", formData);
            console.log("Validation check:", {
                product: formData.product,
                quantity: formData.quantity,
                fromWarehouse: formData.fromWarehouse,
                toWarehouse: formData.toWarehouse
            });

            if (!formData.product || !formData.quantity || !formData.fromWarehouse || !formData.toWarehouse) {
                toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
                return;
            }

            const userRes = await fetch(`${API_BASE_URL}/user`);
            const userData = await userRes.json();
            console.log("User API response:", userData);

            // Try different possible response structures
            const adminUser = userData.data?.[0]?._id || userData.users?.[0]?._id || userData[0]?._id;

            if (!adminUser) {
                toast({ title: "Error", description: "Could not fetch user information", variant: "destructive" });
                console.error("No user ID found in response:", userData);
                return;
            }

            const payload = {
                ...formData,
                quantity: Number(formData.quantity),
                initiatedBy: adminUser
            };

            console.log("Payload being sent:", payload);

            const response = await fetch(`${API_BASE_URL}/movements`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to log movement");
            }

            toast({ title: "Success", description: "Movement logged successfully" });
            setIsLogMoveOpen(false);
            fetchMovements();
            setFormData({
                type: "Transfer",
                product: "",
                quantity: "",
                fromWarehouse: "",
                toWarehouse: "",
                fromLocation: "",
                toLocation: ""
            });
            setTransferScope("inter_warehouse");

        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const filteredMovements = movements.filter(m =>
        m.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Move History</h1>
                    <p className="text-muted-foreground">
                        Track and log internal stock movements.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open(`${API_BASE_URL}/movements/export`, '_blank')}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Dialog open={isLogMoveOpen} onOpenChange={setIsLogMoveOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <ArrowRightLeft className="h-4 w-4 mr-2" />
                                Log Movement
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Log Internal Transfer</DialogTitle>
                                <DialogDescription>
                                    Move stock between warehouses or locations.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select value={formData.type} onValueChange={(v) => handleInputChange("type", v)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Transfer">Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Transfer Scope</Label>
                                        <Select
                                            value={transferScope}
                                            onValueChange={(v) => {
                                                setTransferScope(v);
                                                if (v === "internal") {
                                                    handleInputChange("toWarehouse", formData.fromWarehouse);
                                                } else {
                                                    if (formData.fromWarehouse === formData.toWarehouse) {
                                                        handleInputChange("toWarehouse", "");
                                                    }
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Scope" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="inter_warehouse">Inter-Warehouse</SelectItem>
                                                <SelectItem value="internal">Internal (Same Warehouse)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Product</Label>
                                        <Select
                                            value={formData.product}
                                            onValueChange={(v) => handleInputChange("product", v)}
                                            disabled={!formData.fromWarehouse}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={
                                                    formData.fromWarehouse
                                                        ? products.length > 0
                                                            ? "Select Product"
                                                            : "No products in warehouse"
                                                        : "Select warehouse first"
                                                } />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map(p => (
                                                    <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => handleInputChange("quantity", e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div className="space-y-4">
                                        <Label className="text-muted-foreground font-semibold">From (Source)</Label>
                                        <div className="space-y-2">
                                            <Label>Warehouse</Label>
                                            <Select value={formData.fromWarehouse} onValueChange={(v) => {
                                                handleInputChange("fromWarehouse", v);
                                                if (transferScope === "internal") {
                                                    handleInputChange("toWarehouse", v);
                                                }
                                                // Fetch products available in this warehouse
                                                fetchProductsForWarehouse(v);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Source Warehouse" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {warehouses.map(w => (
                                                        <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input
                                                placeholder="e.g. Main Warehouse, Rack A"
                                                value={formData.fromLocation}
                                                onChange={(e) => handleInputChange("fromLocation", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-muted-foreground font-semibold">To (Destination)</Label>
                                        <div className="space-y-2">
                                            <Label>Warehouse</Label>
                                            <Select
                                                value={formData.toWarehouse}
                                                onValueChange={(v) => handleInputChange("toWarehouse", v)}
                                                disabled={transferScope === "internal"}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Dest Warehouse" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {warehouses.map(w => (
                                                        <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input
                                                placeholder="e.g. Production Floor, Rack B"
                                                value={formData.toLocation}
                                                onChange={(e) => handleInputChange("toLocation", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsLogMoveOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit}>Confirm Transfer</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Movement Ledger</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search product or type..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : filteredMovements.length > 0 ? (
                                filteredMovements.map((m) => (
                                    <TableRow key={m._id}>
                                        <TableCell>{format(new Date(m.createdAt), "MMM dd, yyyy HH:mm")}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{m.type}</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{m.product?.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{m.fromWarehouse?.name}</span>
                                                {m.fromLocation && <span className="text-xs text-muted-foreground">{m.fromLocation}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{m.toWarehouse?.name}</span>
                                                {m.toLocation && <span className="text-xs text-muted-foreground">{m.toLocation}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>{m.quantity}</TableCell>
                                        <TableCell>{m.initiatedBy?.username || "System"}</TableCell>
                                        <TableCell>
                                            <Badge className="bg-green-500">{m.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No movements found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
};

export default MoveHistory;
