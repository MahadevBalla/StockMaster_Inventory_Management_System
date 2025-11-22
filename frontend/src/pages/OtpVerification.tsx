import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import axios from "axios";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import InteractiveGrid from "@/components/animata/background/interactive-grid";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Schema for Email Step
const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

// Schema for OTP Step
const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must be numbers only"),
});

// Schema for Reset Password Step
const resetPasswordSchema = z.object({
    otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must be numbers only"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const OtpVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    // Determine mode: 'verify' (default) or 'reset'
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get("mode") === "reset" ? "reset" : "verify";

    // State
    const [step, setStep] = useState(1); // 1: Email (if not provided), 2: OTP/Reset
    const [email, setEmail] = useState(location.state?.email || "");
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [autoSendTriggered, setAutoSendTriggered] = useState(false);

    // Forms
    const emailForm = useForm({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: email },
    });

    const otpForm = useForm({
        resolver: zodResolver(mode === "reset" ? resetPasswordSchema : otpSchema),
        defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
    });

    // Auto-send OTP logic
    useEffect(() => {
        if (autoSendTriggered) return;

        const initAutoSend = async () => {
            // Scenario 1: Logged-in User Resetting Password
            const storedUser = localStorage.getItem("user");
            // Only auto-send if explicitly requested via state (prevents issues on logout/history nav)
            if (mode === "reset" && storedUser && location.state?.autoSend) {
                const user = JSON.parse(storedUser);
                if (user.email) {
                    setAutoSendTriggered(true);
                    await handleSendOtp({ email: user.email });
                }
            }
            // Scenario 2: Redirected from Login (403) with Username
            else if (location.state?.username) {
                setAutoSendTriggered(true);
                await handleSendOtp({ username: location.state.username });
            }
        };

        initAutoSend();
    }, [mode, location.state, autoSendTriggered]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSendOtp = async (data: { email?: string; username?: string }) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/user/send-otp`, data);

            // Backend now returns the email it sent to
            if (response.data.email) {
                setEmail(response.data.email);
            } else if (data.email) {
                setEmail(data.email);
            }

            setStep(2);
            setCountdown(60);
            toast({
                title: "OTP Sent",
                description: response.data.message || "Please check your email for the verification code.",
            });
        } catch (error) {
            console.error("Send OTP Error:", error);
            toast({
                variant: "destructive",
                title: "Failed to send OTP",
                description: axios.isAxiosError(error) ? error.response?.data?.message : "Something went wrong",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (data: any) => {
        setIsLoading(true);
        try {
            if (mode === "reset") {
                await axios.post(`${API_BASE_URL}/user/reset-password`, {
                    email,
                    otp: data.otp,
                    newPassword: data.newPassword,
                });
                toast({
                    title: "Password Reset Successful",
                    description: "You can now login with your new password.",
                });
            } else {
                await axios.post(`${API_BASE_URL}/user/verify-otp`, {
                    email,
                    otp: data.otp,
                });
                toast({
                    title: "Verification Successful",
                    description: "Your account has been verified.",
                });
            }
            navigate("/login");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: axios.isAxiosError(error) ? error.response?.data?.message : "Invalid OTP or expired",
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="p-0">
                                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                                </Button>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {mode === "reset" ? <KeyRound className="h-8 w-8 text-primary" /> : <ShieldCheck className="h-8 w-8 text-primary" />}
                                </div>
                                {mode === "reset" ? "Reset Password" : "Verify Account"}
                            </CardTitle>
                            <CardDescription className="text-center">
                                {step === 1
                                    ? "Enter your email to receive a One-Time Password (OTP)"
                                    : `Enter the OTP sent to ${email}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {step === 1 ? (
                                <form onSubmit={emailForm.handleSubmit((data) => handleSendOtp(data))} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            {...emailForm.register("email")}
                                            className={emailForm.formState.errors.email ? "border-red-500" : ""}
                                        />
                                        {emailForm.formState.errors.email && (
                                            <p className="text-sm text-red-500">{emailForm.formState.errors.email.message as string}</p>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Sending..." : "Send OTP"}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={otpForm.handleSubmit(handleVerify)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">One-Time Password</Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            maxLength={6}
                                            {...otpForm.register("otp")}
                                            className={otpForm.formState.errors.otp ? "border-red-500 text-center tracking-widest text-lg" : "text-center tracking-widest text-lg"}
                                        />
                                        {otpForm.formState.errors.otp && (
                                            <p className="text-sm text-red-500">{otpForm.formState.errors.otp.message as string}</p>
                                        )}
                                    </div>

                                    {mode === "reset" && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    {...otpForm.register("newPassword")}
                                                    className={otpForm.formState.errors.newPassword ? "border-red-500" : ""}
                                                />
                                                {otpForm.formState.errors.newPassword && (
                                                    <p className="text-sm text-red-500">{otpForm.formState.errors.newPassword.message as string}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    {...otpForm.register("confirmPassword")}
                                                    className={otpForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                                                />
                                                {otpForm.formState.errors.confirmPassword && (
                                                    <p className="text-sm text-red-500">{otpForm.formState.errors.confirmPassword.message as string}</p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Verifying..." : (mode === "reset" ? "Reset Password" : "Verify OTP")}
                                    </Button>

                                    <div className="text-center text-sm">
                                        {countdown > 0 ? (
                                            <span className="text-muted-foreground">Resend OTP in {countdown}s</span>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="p-0 h-auto font-normal"
                                                onClick={() => handleSendOtp({ email })}
                                            >
                                                Resend OTP
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </InteractiveGrid>
    );
};

export default OtpVerification;
