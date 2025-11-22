import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, MoreHorizontal, Shield, UserCog, UserCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import axios from "axios";

// Import the interfaces
import { User } from "@/types/index";

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://https://doreamon-dzoa.onrender.com/api/v1";

// Role descriptions
const roleDescriptions = {
  admin: "Full access to all features and settings",
  manager: "Manage inventory, products, and view analytics",
  staff: "View and update inventory levels",
};

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // Form state for new user - simplified
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "staff" as 'admin' | 'manager' | 'staff',
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Username validation
    if (!newUser.username.trim()) {
      errors.username = "Username is required";
    } else if (newUser.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Email validation
    if (!newUser.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(newUser.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!newUser.password.trim()) {
      errors.password = "Password is required";
    } else if (newUser.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Role validation
    if (!newUser.role) {
      errors.role = "Role is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewUser({ ...newUser, [name]: value });
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleAddUser = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Prepare data for API call - simplified to only include required fields
      const userData = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      };

      // Call the register API endpoint
      const response = await axios.post(`${API_BASE_URL}/user/register`, userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data) {
        toast({
          title: "Success",
          description: `User ${newUser.username} has been added successfully.`,
        });

        // Refresh the user list
        fetchUsers();

        // Reset form and close dialog
        setIsAddUserOpen(false);
        setNewUser({
          username: "",
          email: "",
          password: "",
          role: "staff",
        });
        setFormErrors({});
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      const errorMessage = error.response?.data?.message || "Failed to add user. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search query, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Count users by role
  const userCounts = {
    admin: users.filter(user => user.role === "admin").length,
    manager: users.filter(user => user.role === "manager").length,
    staff: users.filter(user => user.role === "staff").length,
  };

  // Get initials for avatar fallback
  const getInitials = (username: string) => {
    return username
      .split(/[ _]/)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Format date for display
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Never";
    return format(new Date(date), "yyyy-MM-dd hh:mm a");
  };

  // Role icon mapping
  const roleIcons = {
    admin: <Shield className="h-5 w-5 text-primary" />,
    manager: <UserCog className="h-5 w-5 text-blue-500" />,
    staff: <UserCheck className="h-5 w-5 text-green-500" />,
  };

  // Handle password reset
  const handleResetPassword = async (userId: string) => {
    // Implement password reset functionality
    toast({
      title: "Not Implemented",
      description: "Password reset functionality will be implemented later.",
    });
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    // Implement user deletion functionality
    toast({
      title: "Not Implemented",
      description: "User deletion functionality will be implemented later.",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account and assign permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    placeholder="E.g., john_doe"
                    className={formErrors.username ? "border-red-500" : ""}
                  />
                  {formErrors.username && (
                    <p className="text-xs text-red-500">{formErrors.username}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    placeholder="E.g., john.doe@example.com"
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500">{formErrors.email}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    className={formErrors.password ? "border-red-500" : ""}
                  />
                  {formErrors.password && (
                    <p className="text-xs text-red-500">{formErrors.password}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: 'admin' | 'manager' | 'staff') => handleSelectChange("role", value)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {newUser.role && roleDescriptions[newUser.role]}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Administrators</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{userCounts.admin}</div>
            <p className="text-sm text-muted-foreground">Full access users</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <UserCog className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Managers</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{userCounts.manager}</div>
            <p className="text-sm text-muted-foreground">Inventory managers</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Staff Members</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{userCounts.staff}</div>
            <p className="text-sm text-muted-foreground">Limited access users</p>
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by username or email..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                {/* <TableHead>Warehouse</TableHead> */}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {roleIcons[user.role]}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      {typeof user.warehouses === 'string' ? (
                        <Badge variant="outline" className="text-xs">
                          {getWarehouseName(user.warehouses)}
                        </Badge>
                      ) : Array.isArray(user.warehouses) && user.warehouses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.warehouses.map(warehouseId => (
                            <Badge key={typeof warehouseId === 'string' ? warehouseId : warehouseId._id} variant="outline" className="text-xs">
                              {typeof warehouseId === 'string' ? getWarehouseName(warehouseId) : warehouseId.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">None assigned</span>
                      )}
                    </TableCell> */}
                    <TableCell>
                      {user.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="border-muted-foreground">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
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
                          <DropdownMenuItem onClick={() => handleResetPassword(user._id)}>
                            <Lock className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDeleteUser(user._id)}
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
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    {isLoading ? "Loading users..." : "No users found with the current filters."}
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

export default Users;