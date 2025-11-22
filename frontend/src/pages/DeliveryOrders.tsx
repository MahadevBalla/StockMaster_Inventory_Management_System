import { useState, useEffect } from "react";
import { Plus, Search, Check, X, Eye, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DeliveryOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const { toast } = useToast();

    const [newOrder, setNewOrder] = useState({
        customer: "",
        warehouse: "",
        items: [],
        reference: ""
    });

    const [currentItem, setCurrentItem] = useState({
        product: "",
        quantity: 1
    });

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        fetchWarehouses();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/delivery-orders`);
            setOrders(response.data);
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to fetch delivery orders",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products?limit=1000`);
            setProducts(response.data.products);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/warehouse`);
            setWarehouses(response.data.data || []);
        } catch (err) {
            console.error("Failed to fetch warehouses", err);
        }
    };

    const handleAddItem = () => {
        if (!currentItem.product || currentItem.quantity <= 0) {
            toast({ title: "Invalid Item", description: "Please select a product and quantity", variant: "destructive" });
            return;
        }
        setNewOrder({
            ...newOrder,
            items: [...newOrder.items, currentItem]
        });
        setCurrentItem({ product: "", quantity: 1 });
    };

    const handleRemoveItem = (index) => {
        const updatedItems = [...newOrder.items];
        updatedItems.splice(index, 1);
        setNewOrder({ ...newOrder, items: updatedItems });
    };

    const handleCreateOrder = async () => {
        if (!newOrder.customer || !newOrder.warehouse || newOrder.items.length === 0) {
            toast({ title: "Validation Error", description: "Please fill all required fields and add items", variant: "destructive" });
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/delivery-orders`, newOrder);
            toast({ title: "Success", description: "Delivery Order created successfully" });
            setIsAddDialogOpen(false);
            setNewOrder({ customer: "", warehouse: "", items: [], reference: "" });
            fetchOrders();
        } catch (err) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to create order", variant: "destructive" });
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`${API_BASE_URL}/delivery-orders/${id}/status`, { status });
            toast({ title: "Success", description: `Order status updated to ${status}` });
            fetchOrders();
            if (viewOrder) {
                setViewOrder({ ...viewOrder, status });
            }
        } catch (err) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to update status", variant: "destructive" });
        }
    };

    const handleValidateOrder = async (id) => {
        if (confirm("Are you sure you want to validate this order? This will decrease stock levels.")) {
            try {
                await axios.post(`${API_BASE_URL}/delivery-orders/${id}/validate`);
                toast({ title: "Success", description: "Order validated and stock updated" });
                fetchOrders();
                setViewOrder(null);
            } catch (err) {
                toast({ title: "Error", description: err.response?.data?.message || "Failed to validate order", variant: "destructive" });
            }
        }
    };

    const getProductName = (id) => {
        const product = products.find(p => p._id === id);
        return product ? product.name : "Unknown Product";
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Delivery Orders (Outgoing Goods)</h1>
                    <p className="text-muted-foreground">Manage outgoing shipments to customers</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                </Button>
            </div>

            <Card className="p-6">
                {loading ? (
                    <div className="flex justify-center p-12"><Spinner /></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reference</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className="font-medium">{order.reference || order._id.substring(0, 8)}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.warehouse?.name || "Unknown"}</TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === "Validated" ? "default" : "secondary"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => setViewOrder(order)}>
                                            <Eye className="h-4 w-4 mr-2" /> View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Add Order Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Create New Delivery Order</DialogTitle>
                        <DialogDescription>Record outgoing goods for a customer.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Customer</Label>
                                <Input
                                    value={newOrder.customer}
                                    onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                                    placeholder="Customer Name"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Warehouse</Label>
                                <Select
                                    value={newOrder.warehouse}
                                    onValueChange={(value) => setNewOrder({ ...newOrder, warehouse: value })}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select Warehouse" /></SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map(w => <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Reference (Optional)</Label>
                            <Input
                                value={newOrder.reference}
                                onChange={(e) => setNewOrder({ ...newOrder, reference: e.target.value })}
                                placeholder="SO Number, Invoice #"
                            />
                        </div>

                        <div className="border-t pt-4 mt-2">
                            <h3 className="font-medium mb-2">Add Items</h3>
                            <div className="flex gap-2 items-end mb-4">
                                <div className="flex-1">
                                    <Label>Product</Label>
                                    <Select
                                        value={currentItem.product}
                                        onValueChange={(value) => setCurrentItem({ ...currentItem, product: value })}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
                                        <SelectContent>
                                            {products.map(p => <SelectItem key={p._id} value={p._id}>{p.name} ({p.sku})</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-24">
                                    <Label>Qty</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={currentItem.quantity}
                                        onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <Button onClick={handleAddItem}><Plus className="h-4 w-4" /></Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {newOrder.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{getProductName(item.product)}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                                                    <X className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateOrder}>Create Order</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Order Dialog */}
            {viewOrder && (
                <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Delivery Order Details</DialogTitle>
                            <DialogDescription>{viewOrder.reference || viewOrder._id}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="font-bold">Customer:</span> {viewOrder.customer}</div>
                                <div><span className="font-bold">Warehouse:</span> {viewOrder.warehouse?.name}</div>
                                <div><span className="font-bold">Date:</span> {new Date(viewOrder.date).toLocaleDateString()}</div>
                                <div><span className="font-bold">Status:</span> {viewOrder.status}</div>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {viewOrder.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.product?.name || "Unknown"}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <DialogFooter className="flex justify-between items-center">
                            <div className="flex gap-2">
                                {viewOrder.status === "Draft" && (
                                    <Button onClick={() => handleUpdateStatus(viewOrder._id, "Picked")}>
                                        <Package className="h-4 w-4 mr-2" /> Mark as Picked
                                    </Button>
                                )}
                                {viewOrder.status === "Picked" && (
                                    <Button onClick={() => handleUpdateStatus(viewOrder._id, "Packed")}>
                                        <Package className="h-4 w-4 mr-2" /> Mark as Packed
                                    </Button>
                                )}
                                {viewOrder.status === "Packed" && (
                                    <Button onClick={() => handleValidateOrder(viewOrder._id)}>
                                        <Truck className="h-4 w-4 mr-2" /> Validate & Ship
                                    </Button>
                                )}
                            </div>
                            <Button variant="outline" onClick={() => setViewOrder(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default DeliveryOrders;
