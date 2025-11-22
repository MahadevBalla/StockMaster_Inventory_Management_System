
import { useState } from "react";
import { Plus, Search, Edit, Trash, MoreHorizontal, Box, Layers, BarChart } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Sample categories data
const categoriesData = [
  {
    id: "cat-1",
    name: "Electronics",
    description: "Electronic devices and components",
    productCount: 24,
    totalStock: 423,
    stockValue: 124500,
    status: "active",
  },
  {
    id: "cat-2",
    name: "Office Supplies",
    description: "Supplies and materials for office use",
    productCount: 18,
    totalStock: 320,
    stockValue: 32000,
    status: "active",
  },
  {
    id: "cat-3",
    name: "Furniture",
    description: "Furniture items for office and home",
    productCount: 12,
    totalStock: 85,
    stockValue: 95000,
    status: "active",
  },
  {
    id: "cat-4",
    name: "Pharmaceutical",
    description: "Medical supplies and pharmaceuticals",
    productCount: 9,
    totalStock: 150,
    stockValue: 85000,
    status: "active",
  },
  {
    id: "cat-5",
    name: "Food",
    description: "Food products and ingredients",
    productCount: 15,
    totalStock: 230,
    stockValue: 28000,
    status: "active",
  },
];

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const { toast } = useToast();

  // Form state for new category
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleAddCategory = () => {
    // In a real app, this would send data to an API
    toast({
      title: "Category Added",
      description: `${newCategory.name} has been added to your categories.`,
    });
    setIsAddCategoryOpen(false);
    // Reset form
    setNewCategory({
      name: "",
      description: "",
    });
  };

  // Filter categories based on search query
  const filteredCategories = categoriesData.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculate total products and stock for the summary
  const totalProducts = categoriesData.reduce((sum, cat) => sum + cat.productCount, 0);
  const totalStockItems = categoriesData.reduce((sum, cat) => sum + cat.totalStock, 0);
  const totalStockValue = categoriesData.reduce((sum, cat) => sum + cat.stockValue, 0);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Organize products into logical groups
          </p>
        </div>
        <div>
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category to organize your products.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCategory.name}
                    onChange={handleInputChange}
                    placeholder="E.g., Hardware"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    placeholder="Describe this category..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>
                  Add Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Box className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Total Categories</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{categoriesData.length}</div>
            <p className="text-sm text-muted-foreground">Organizing {totalProducts} products</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Total Stock Items</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{totalStockItems}</div>
            <p className="text-sm text-muted-foreground">Across all categories</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Total Stock Value</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">${totalStockValue.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Current inventory value</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8 max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredCategories.map((category) => {
            // Calculate what percentage this category represents of the total stock
            const stockPercentage = Math.round((category.totalStock / totalStockItems) * 100);

            return (
              <Card key={category.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Products:</span>
                      <span className="font-medium">{category.productCount}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Stock:</span>
                      <span className="font-medium">{category.totalStock} items</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Value:</span>
                      <span className="font-medium">${category.stockValue.toLocaleString()}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">% of Total Stock</span>
                        <span>{stockPercentage}%</span>
                      </div>
                      <Progress value={stockPercentage} className="h-1" />
                    </div>
                  </div>
                </div>
                <div className="bg-muted p-2 flex justify-end">
                  <Button variant="ghost" size="sm">View Products</Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                    <TableCell className="text-right">{category.productCount}</TableCell>
                    <TableCell className="text-right">{category.totalStock}</TableCell>
                    <TableCell className="text-right">${category.stockValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No categories found with the current search query.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default Categories;
