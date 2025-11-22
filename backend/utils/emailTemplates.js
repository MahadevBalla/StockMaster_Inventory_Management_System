// HTML Email Templates for StockMaster

export const otpEmailTemplate = (otp, username) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                🔐 StockMaster
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                                Inventory Management System
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                                Your Verification Code
                            </h2>
                            
                            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${username || 'User'}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                                We received a request to verify your account. Use the code below to complete the verification:
                            </p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                                <tr>
                                    <td align="center" style="padding: 30px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 8px; border: 2px dashed #9ca3af;">
                                        <div style="font-size: 42px; font-weight: 700; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                This code will expire in <strong style="color: #dc2626;">5 minutes</strong>.
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                If you didn't request this code, please ignore this email or contact support if you have concerns.
                            </p>
                            
                            <!-- Security Notice -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 16px; margin: 0 0 30px 0;">
                                <tr>
                                    <td style="padding: 0;">
                                        <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                                            <strong>⚠️ Security Tip:</strong> Never share this code with anyone. StockMaster will never ask for your OTP via phone or email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                                This is an automated message from StockMaster Inventory Management System.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                                © ${new Date().getFullYear()} StockMaster. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

export const passwordResetEmailTemplate = (otp, username) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                🔒 Password Reset
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #fecaca; font-size: 14px;">
                                StockMaster Security
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                                Reset Your Password
                            </h2>
                            
                            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${username || 'User'}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password. Use the code below to proceed:
                            </p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                                <tr>
                                    <td align="center" style="padding: 30px; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 8px; border: 2px dashed #f87171;">
                                        <div style="font-size: 42px; font-weight: 700; color: #dc2626; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                This code will expire in <strong style="color: #dc2626;">5 minutes</strong>.
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                If you didn't request a password reset, please ignore this email and ensure your account is secure.
                            </p>
                            
                            <!-- Security Notice -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fee2e2; border-left: 4px solid #dc2626; border-radius: 4px; padding: 16px; margin: 0 0 30px 0;">
                                <tr>
                                    <td style="padding: 0;">
                                        <p style="margin: 0; color: #7f1d1d; font-size: 13px; line-height: 1.5;">
                                            <strong>🔐 Security Alert:</strong> If you didn't request this password reset, someone may be trying to access your account. Please contact support immediately.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                                This is an automated security message from StockMaster.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                                © ${new Date().getFullYear()} StockMaster. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};
