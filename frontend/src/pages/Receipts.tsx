import { useState, useEffect } from "react";
import { Plus, Search, Check, X, Eye } from "lucide-react";
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

const Receipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [viewReceipt, setViewReceipt] = useState(null);
    const { toast } = useToast();

    const [newReceipt, setNewReceipt] = useState({
        supplier: "",
        warehouse: "",
        items: [],
        reference: ""
    });

    const [currentItem, setCurrentItem] = useState({
        product: "",
        quantity: 1,
        unitPrice: 0
    });

    useEffect(() => {
        fetchReceipts();
        fetchProducts();
        fetchWarehouses();
    }, []);

    const fetchReceipts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/receipts`);
            setReceipts(response.data);
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to fetch receipts",
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
        setNewReceipt({
            ...newReceipt,
            items: [...newReceipt.items, currentItem]
        });
        setCurrentItem({ product: "", quantity: 1, unitPrice: 0 });
    };

    const handleRemoveItem = (index) => {
        const updatedItems = [...newReceipt.items];
        updatedItems.splice(index, 1);
        setNewReceipt({ ...newReceipt, items: updatedItems });
    };

    const handleCreateReceipt = async () => {
        if (!newReceipt.supplier || !newReceipt.warehouse || newReceipt.items.length === 0) {
            toast({ title: "Validation Error", description: "Please fill all required fields and add items", variant: "destructive" });
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/receipts`, newReceipt);
            toast({ title: "Success", description: "Receipt created successfully" });
            setIsAddDialogOpen(false);
            setNewReceipt({ supplier: "", warehouse: "", items: [], reference: "" });
            fetchReceipts();
        } catch (err) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to create receipt", variant: "destructive" });
        }
    };

    const handleValidateReceipt = async (id) => {
        if (confirm("Are you sure you want to validate this receipt? This will update stock levels.")) {
            try {
                await axios.post(`${API_BASE_URL}/receipts/${id}/validate`);
                toast({ title: "Success", description: "Receipt validated and stock updated" });
                fetchReceipts();
                setViewReceipt(null); // Close view dialog if open
            } catch (err) {
                toast({ title: "Error", description: err.response?.data?.message || "Failed to validate receipt", variant: "destructive" });
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
                    <h1 className="text-2xl font-bold tracking-tight">Receipts (Incoming Goods)</h1>
                    <p className="text-muted-foreground">Manage incoming stock from suppliers</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Receipt
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
                                <TableHead>Supplier</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {receipts.map((receipt) => (
                                <TableRow key={receipt._id}>
                                    <TableCell className="font-medium">{receipt.reference || receipt._id.substring(0, 8)}</TableCell>
                                    <TableCell>{receipt.supplier}</TableCell>
                                    <TableCell>{receipt.warehouse?.name || "Unknown"}</TableCell>
                                    <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={receipt.status === "Validated" ? "default" : "secondary"}>
                                            {receipt.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => setViewReceipt(receipt)}>
                                            <Eye className="h-4 w-4 mr-2" /> View
                                        </Button>
                                        {receipt.status === "Draft" && (
                                            <Button variant="outline" size="sm" className="ml-2" onClick={() => handleValidateReceipt(receipt._id)}>
                                                <Check className="h-4 w-4 mr-2" /> Validate
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Add Receipt Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Create New Receipt</DialogTitle>
                        <DialogDescription>Record incoming goods from a supplier.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Supplier</Label>
                                <Input
                                    value={newReceipt.supplier}
                                    onChange={(e) => setNewReceipt({ ...newReceipt, supplier: e.target.value })}
                                    placeholder="Supplier Name"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Warehouse</Label>
                                <Select
                                    value={newReceipt.warehouse}
                                    onValueChange={(value) => setNewReceipt({ ...newReceipt, warehouse: value })}
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
                                value={newReceipt.reference}
                                onChange={(e) => setNewReceipt({ ...newReceipt, reference: e.target.value })}
                                placeholder="PO Number, Invoice #"
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
                                <div className="w-24">
                                    <Label>Price</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={currentItem.unitPrice}
                                        onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: Number(e.target.value) })}
                                    />
                                </div>
                                <Button onClick={handleAddItem}><Plus className="h-4 w-4" /></Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {newReceipt.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{getProductName(item.product)}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.unitPrice}</TableCell>
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
                        <Button onClick={handleCreateReceipt}>Create Receipt</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Receipt Dialog */}
            {viewReceipt && (
                <Dialog open={!!viewReceipt} onOpenChange={(open) => !open && setViewReceipt(null)}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Receipt Details</DialogTitle>
                            <DialogDescription>{viewReceipt.reference || viewReceipt._id}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="font-bold">Supplier:</span> {viewReceipt.supplier}</div>
                                <div><span className="font-bold">Warehouse:</span> {viewReceipt.warehouse?.name}</div>
                                <div><span className="font-bold">Date:</span> {new Date(viewReceipt.date).toLocaleDateString()}</div>
                                <div><span className="font-bold">Status:</span> {viewReceipt.status}</div>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {viewReceipt.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.product?.name || "Unknown"}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.unitPrice}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <DialogFooter>
                            {viewReceipt.status === "Draft" && (
                                <Button onClick={() => handleValidateReceipt(viewReceipt._id)}>
                                    <Check className="h-4 w-4 mr-2" /> Validate Receipt
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => setViewReceipt(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default Receipts;
