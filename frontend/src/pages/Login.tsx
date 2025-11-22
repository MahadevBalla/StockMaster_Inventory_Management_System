import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, User } from "lucide-react";
import axios from "axios";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import InteractiveGrid from "@/components/animata/background/interactive-grid"


// Form schema
const loginFormSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().min(1, "Role is required"),
    rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: "",
            role: "",
            rememberMe: false,
        },
    });

    const handleRoleChange = (value: string) => {
        setValue("role", value);
    };

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);

        try {
            // Call backend API to authenticate user
            const response = await axios.post(`${API_BASE_URL}/user/login`, {
                username: data.username,
                password: data.password,
                role: data.role,
            }, {
                withCredentials: true
            });

            console.log("Server response:", response);
            console.log("response.data:", response.data);

            if (!response.data) {
                throw new Error("No data received from server");
            }

            // Check if response has the expected structure
            if (!response.data?.user || !response.data?.tokens?.accessToken) {
                throw new Error("Invalid response structure from server");
            }

            // Extract user data and tokens
            const { user, tokens } = response.data;
            const { accessToken } = tokens;

            const storage = data.rememberMe ? localStorage : sessionStorage;

            // Store auth data based on "remember me" setting
            if (data.rememberMe) {
                localStorage.setItem("token", accessToken);
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                sessionStorage.setItem("token", accessToken);
                sessionStorage.setItem("user", JSON.stringify(user));
            }

            // Set default authorization header for subsequent requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

            // Success notification
            toast({
                title: "Login successful",
                description: `Welcome back, ${user.username}. You are logged in as ${user.role}.`,
            });

            // Redirect based on role
            switch (user.role) {
                case "admin":
                    navigate("/index");
                    break;
                case "manager":
                    navigate("/warehouses");
                    break;
                case "staff":
                    navigate("/stock");
                    break;
                default:
                    navigate("/");
            }
        } catch (error) {
            // Handle different types of errors
            let errorMessage = "Login failed. Please try again.";

            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;

                if (statusCode === 401) {
                    errorMessage = "Invalid email or password";
                } else if (statusCode === 403) {
                    errorMessage = "Your account has been deactivated";
                } else if (statusCode === 404) {
                    errorMessage = "Account not found";
                } else if (statusCode >= 500) {
                    errorMessage = "Server error. Please try again later";
                }
            }

            toast({
                variant: "destructive",
                title: "Login failed",
                description: errorMessage,
            });

            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (

        <InteractiveGrid className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-center min-h-screen p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card className="shadow-lg">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <User className="h-6 w-6" />
                                    <span>Inventory Management</span>
                                </motion.div>
                            </CardTitle>
                            <CardDescription className="text-center">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        {...register("username")}
                                        className={errors.username ? "border-red-500" : ""}
                                    />
                                    {errors.username && (
                                        <p className="text-sm text-red-500">{errors.username.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...register("password")}
                                            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-0 top-0 h-full px-3 py-2"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-500">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select onValueChange={handleRoleChange}>
                                        <SelectTrigger
                                            className={errors.role ? "border-red-500" : ""}
                                            aria-label="Select role"
                                        >
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-red-500">{errors.role.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="rememberMe"
                                        onCheckedChange={(checked) => {
                                            setValue("rememberMe", checked === true);
                                        }}
                                    />
                                    <Label
                                        htmlFor="rememberMe"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Remember me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                                        </motion.div>
                                    ) : (
                                        <>
                                            <LogIn className="mr-2 h-4 w-4" /> Sign In
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-2">
                            <div className="text-sm text-center text-gray-500">
                                Inventory Management System
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </InteractiveGrid>
    );

};

export default Login;