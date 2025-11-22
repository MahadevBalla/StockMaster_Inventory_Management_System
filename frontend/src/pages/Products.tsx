import { useState, useEffect } from "react";
import { Plus, Search, FileUp, Filter, Download, Edit, Trash, MoreHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";

// API Base URL
const API_BASE_URL = "https://doreamon-dzoa.onrender.com/api/v1";

const categories = [
  "All Categories",
  "Electronics",
  "Office Supplies",
  "Pharmaceutical",
  "Food",
  "Other"
];

const Products = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();

  // Initial product state
  const initialProductState = {
    name: "",
    description: "",
    category: "",
    stock: 0,
    unit: "piece",
    minStockLevel: 10,
    isPerishable: false,
    defaultExpiryDays: null,
    warehouse: ""
  };

  const [newProduct, setNewProduct] = useState({ ...initialProductState });
  const [warehouses, setWarehouses] = useState([]);

  // Fetch products function
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          page: currentPage,
          limit: 10
        }
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setCurrentPage(Number(response.data.currentPage));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch warehouses function
  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/warehouse`);
      setWarehouses(response.data);
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, [currentPage]);

  // Handle input change for forms
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;

    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: finalValue });
    } else {
      setNewProduct({ ...newProduct, [name]: finalValue });
    }
  };

  // Handle select change for forms
  const handleSelectChange = (name, value) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Handle switch change for forms
  const handleSwitchChange = (name, checked) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: checked });
    } else {
      setNewProduct({ ...newProduct, [name]: checked });
    }
  };

  // Create a new product
  const handleAddProduct = async () => {
    try {
      await axios.post(`${API_BASE_URL}/products`, newProduct);
      toast({
        title: "Product Added",
        description: `${newProduct.name} has been added to the catalog.`,
      });
      setIsAddDialogOpen(false);
      setNewProduct({ ...initialProductState });
      fetchProducts(); // Refetch products after adding
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add product",
        variant: "destructive"
      });
    }
  };

  // Update an existing product
  const handleUpdateProduct = async () => {
    try {
      const encodedName = encodeURIComponent(editingProduct.name);
      await axios.patch(`${API_BASE_URL}/products/update/${encodedName}`, editingProduct);
      toast({
        title: "Product Updated",
        description: `${editingProduct.name} has been updated.`,
      });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      fetchProducts(); // Refetch products after updating
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update product",
        variant: "destructive"
      });
    }
  };

  // Delete a product
  const handleDeleteProduct = async (productId, warehouseId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_BASE_URL}/products/delete/${productId}`);
        toast({
          title: "Product Deleted",
          description: "The product has been removed from the catalog.",
        });
        fetchProducts(); // Refetch products after deleting
      } catch (err) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to delete product",
          variant: "destructive"
        });
      }
    }
  };

 

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter;

    const hasLowStock = product.stock <= product.minStockLevel;
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "low_stock" && hasLowStock) ||
      (statusFilter === "active" && !hasLowStock);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Open the edit dialog with product data
  const openEditDialog = (product) => {
    setEditingProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <div className="flex gap-2">
          

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new product to your catalog.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      placeholder="E.g., Blue Widgets"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Describe the product"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="warehouse">Warehouse</Label>
                    <Select
                      value={newProduct.warehouse}
                      onValueChange={(value) => handleSelectChange("warehouse", value)}
                    >
                      <SelectTrigger id="warehouse">
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(warehouses) && warehouses.length > 0
                          ? warehouses.map((warehouse) => (
                            <SelectItem key={warehouse._id} value={warehouse._id}>
                              {warehouse.name}
                            </SelectItem>
                          ))
                          : <SelectItem value="no-warehouses">No warehouses available</SelectItem>
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newProduct.unit}
                      onValueChange={(value) => handleSelectChange("unit", value)}
                    >
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStockLevel">Min Stock Level</Label>
                    <Input
                      id="minStockLevel"
                      name="minStockLevel"
                      type="number"
                      min="0"
                      value={newProduct.minStockLevel}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="isPerishable" className="flex items-center justify-between">
                      Track Expiry Date
                      <Switch
                        id="isPerishable"
                        checked={newProduct.isPerishable}
                        onCheckedChange={(checked) => handleSwitchChange("isPerishable", checked)}
                      />
                    </Label>
                  </div>
                  {newProduct.isPerishable && (
                    <div className="grid gap-2">
                      <Label htmlFor="defaultExpiryDays">Default Expiry Days</Label>
                      <Input
                        id="defaultExpiryDays"
                        name="defaultExpiryDays"
                        type="number"
                        min="1"
                        value={newProduct.defaultExpiryDays || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Normal Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="h-8 w-8 flex justify-center items-center">
                <Spinner />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">
              {error}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock Level</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Min Stock Level</TableHead>
                  <TableHead>Perishable</TableHead>
                  <TableHead>Expiry Days</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{product.description}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">
                        <span className={product.stock <= product.minStockLevel ? "text-red-500 font-medium" : ""}>
                          {product.stock}
                        </span>
                        {product.stock <= product.minStockLevel && (
                          <Badge variant="destructive" className="ml-2">Low</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.unit}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{product.minStockLevel}</TableCell>
                      <TableCell>
                        {product.isPerishable ? (
                          <Badge variant="outline" className="bg-blue-50">Yes</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>{product.defaultExpiryDays || '-'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(product)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProduct(product._id, product.warehouse)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      No products found with the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={editingProduct.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-warehouse">Warehouse</Label>
                  <Select
                    value={editingProduct.warehouse}
                    onValueChange={(value) => handleSelectChange("warehouse", value)}
                  >
                    <SelectTrigger id="edit-warehouse">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse._id} value={warehouse._id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Stock Adjustment</Label>
                  <Input
                    id="edit-stock"
                    name="stock"
                    type="number"
                    placeholder="Enter positive or negative value"
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">Current: {editingProduct.stock}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Select
                    value={editingProduct.unit}
                    onValueChange={(value) => handleSelectChange("unit", value)}
                  >
                    <SelectTrigger id="edit-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-minStockLevel">Min Stock Level</Label>
                  <Input
                    id="edit-minStockLevel"
                    name="minStockLevel"
                    type="number"
                    min="0"
                    value={editingProduct.minStockLevel}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-isPerishable" className="flex items-center justify-between">
                    Track Expiry Date
                    <Switch
                      id="edit-isPerishable"
                      checked={editingProduct.isPerishable}
                      onCheckedChange={(checked) => handleSwitchChange("isPerishable", checked)}
                    />
                  </Label>
                </div>
                {editingProduct.isPerishable && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-defaultExpiryDays">Default Expiry Days</Label>
                    <Input
                      id="edit-defaultExpiryDays"
                      name="defaultExpiryDays"
                      type="number"
                      min="1"
                      value={editingProduct.defaultExpiryDays || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct}>
                Update Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Products;