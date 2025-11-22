import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Package,
  Layers,
  ClipboardList,
  Store,
  Tag,
  Users,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
  Home,
  Receipt,
  KeyRound,
  Truck,
  ArrowRightLeft
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type UserRole = "admin" | "manager" | "staff";

interface Warehouse {
  _id: string;
  name: string;
}

interface User {
  username: string;
  role: UserRole;
  warehouses: Warehouse[];
}

interface SidebarProps {
  currentUser: User;
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  disabled?: boolean;
  hasSubItems?: boolean;
  isOpen?: boolean;
  showExpand?: boolean;
  toggleExpand?: () => void;
}

// Define which routes are available to each role
const roleBasedRoutes: Record<UserRole, string[]> = {
  admin: [
    "/",
    "/analytics",
    "/products",
    "/stock",
    "/receipts",
    "/delivery-orders",
    "/logs",
    "/warehouses",
    "/categories",
    "/users",
    "/settings",
    "/move-history"
  ],
  manager: [
    "/",
    "/analytics",
    "/products",
    "/stock",
    "/receipts",
    "/delivery-orders",
    "/logs",
    "/warehouses",
    "/categories",
    "/move-history"
  ],
  staff: [
    "/",
    "/stock",
    "/products",
    "/move-history"
  ]
};

const NavItem = ({
  href,
  icon: Icon,
  label,
  active,
  onClick,
  collapsed = false,
  disabled = false,
  hasSubItems = false,
  isOpen = false,
  showExpand = false,
  toggleExpand
}: NavItemProps) => {
  const commonClasses = cn(
    "flex items-center py-2 px-3 rounded-md gap-2 w-full",
    active ? "bg-primary text-primary-foreground" : "hover:bg-accent",
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  );

  // Handle expand button click
  const handleExpandClick = (e: React.MouseEvent) => {
    if (toggleExpand) {
      e.preventDefault();
      e.stopPropagation();
      toggleExpand();
    }
  };

  return (
    <li className="my-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              {disabled ? (
                <div className={commonClasses} onClick={onClick}>
                  {Icon && <Icon className="h-5 w-5" />}
                  {!collapsed && <span className="text-sm">{label}</span>}
                  {hasSubItems && showExpand && !collapsed && (
                    <div className="ml-auto">
                      <button onClick={handleExpandClick}>
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to={href} className={commonClasses} onClick={onClick}>
                  {Icon && <Icon className="h-5 w-5" />}
                  {!collapsed && <span className="text-sm">{label}</span>}
                  {hasSubItems && showExpand && !collapsed && (
                    <div className="ml-auto">
                      <button onClick={handleExpandClick}>
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                    </div>
                  )}
                </Link>
              )}
            </div>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};

const Sidebar = ({ currentUser }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [warehousesOpen, setWarehousesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Clear user data from storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  const isRouteVisible = (route: string) => {
    return roleBasedRoutes[currentUser.role].includes(route);
  };

  const navigationItems = [
    {
      href: "/index",
      icon: Home,
      label: "Dashboard",
      visible: isRouteVisible("/")
    },
    {
      href: "/analytics",
      icon: BarChart3,
      label: "Analytics",
      visible: isRouteVisible("/analytics")
    },
    {
      href: "/products",
      icon: Package,
      label: "Products",
      visible: isRouteVisible("/products")
    },
    {
      href: "/stock",
      icon: Layers,
      label: "Stock Management",
      visible: isRouteVisible("/stock")
    },
    {
      href: "/move-history",
      icon: ArrowRightLeft,
      label: "Move History",
      visible: isRouteVisible("/move-history")
    },
    {
      href: "/logs",
      icon: ClipboardList,
      label: "Activity Logs",
      visible: isRouteVisible("/logs")
    },
    {
      href: "/warehouses",
      icon: Store,
      label: "Warehouses",
      visible: isRouteVisible("/warehouses"),
      hasSubItems: currentUser.role !== "admin" && currentUser.warehouses?.length > 0,
      subItems: currentUser.warehouses?.map(warehouse => ({
        href: `/warehouses/${warehouse._id}`,
        label: warehouse.name,
        icon: Store,
        visible: true
      })) || []
    },
    {
      href: "/categories",
      icon: Tag,
      label: "Categories",
      visible: isRouteVisible("/categories")
    },
    {
      href: "/users",
      icon: Users,
      label: "User Management",
      visible: isRouteVisible("/users")
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      visible: isRouteVisible("/settings")
    }
  ];

  const sidebarContent = (
    <div className={cn(
      "h-full flex flex-col bg-background border-r",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-lg"
          >
            StockMaster
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>



      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            if (!item.visible) return null;

            if (item.hasSubItems) {
              return (
                <Collapsible
                  key={item.href}
                  open={warehousesOpen}
                  onOpenChange={setWarehousesOpen}
                >
                  <CollapsibleTrigger asChild>
                    <div>
                      <NavItem
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        active={location.pathname === item.href}
                        collapsed={collapsed}
                        hasSubItems={item.hasSubItems}
                        isOpen={warehousesOpen}
                        showExpand={true}
                        toggleExpand={() => setWarehousesOpen(!warehousesOpen)}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {!collapsed && item.subItems && (
                      <ul className="pl-7 pt-1">
                        {item.subItems.map((subItem) => (
                          <NavItem
                            key={subItem.href}
                            href={subItem.href}
                            icon={subItem.icon}
                            label={subItem.label}
                            active={location.pathname === subItem.href}
                            collapsed={collapsed}
                          />
                        ))}
                      </ul>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.href}
                collapsed={collapsed}
              />
            );
          })}
        </ul>
      </nav>

      {/* User info (moved to bottom) */}
      <div className={cn(
        "flex items-center p-4 border-t mt-auto",
        collapsed ? "justify-center" : "justify-start"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={cn("flex items-center cursor-pointer", collapsed ? "justify-center" : "w-full")}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.username}`} />
                <AvatarFallback>{currentUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-3 flex-1"
                >
                  <div className="font-medium text-sm">{currentUser.username}</div>
                  <div className="text-xs text-muted-foreground capitalize">{currentUser.role}</div>
                </motion.div>
              )}
              {!collapsed && <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/otp-verification?mode=reset", { state: { autoSend: true } })}>
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Reset Password</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-40"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="h-full">
              {sidebarContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;