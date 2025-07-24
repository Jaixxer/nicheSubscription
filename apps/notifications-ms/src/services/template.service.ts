export class NotificationTemplates {
    static verifyEmail(name: string, link: string): { subject: string; html: string } {
        return {
            subject: `Welcome ${name}! Please verify your email`,
            html: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                            h1 { color: #2c3e50; margin-bottom: 20px; }
                            .btn { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
                            .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
                            .footer { margin-top: 30px; font-size: 14px; color: #666; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Welcome to Our Service, ${name}!</h1>
                            <p>Thank you for joining us. We are excited to have you on board.</p>
                            <p>Please click the link below to verify your email address:</p>
                            <a href="${link}" class="btn">Verify Email</a>
                            <div class="footer">
                                <p>If you did not create an account, please ignore this email.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };
    }

    static emailVerifiedAndWelcome(name: string): { subject: string; html: string } {
        return {
            subject: `Welcome ${name}! Your email has been verified`,
            html: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                            h1 { color: #27ae60; margin-bottom: 20px; }
                            .success-badge { background: #27ae60; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; display: inline-block; margin-bottom: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="success-badge">✓ Email Verified</div>
                            <h1>Welcome to Our Service, ${name}!</h1>
                            <p>Your email has been successfully verified. You can now enjoy all the features of our service.</p>
                            <p>Thank you for joining us!</p>
                        </div>
                    </body>
                </html>
            `
        };
    }

    static passwordReset(name: string, link: string): { subject: string; html: string } {
        return {
            subject: `Password Reset Request for ${name}`,
            html: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                            h1 { color: #e74c3c; margin-bottom: 20px; }
                            .btn { display: inline-block; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
                            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Password Reset Request</h1>
                            <p>Hi ${name},</p>
                            <div class="warning">
                                <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
                            </div>
                            <p>To reset your password, please click the link below:</p>
                            <a href="${link}" class="btn">Reset Password</a>
                            <p>If you have any questions, feel free to contact our support team.</p>
                        </div>
                    </body>
                </html>
            `
        };
    }
    static subscriptionBought(
        name: string,
        subscriptionName: string,
        cost: string,
        frequency: string
    ): { subject: string; html: string; name: string; cost: string; frequency: string } {
        return {
            subject: `Subscription Confirmation for ${subscriptionName}`,
            html: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                            h1 { color: #8e44ad; margin-bottom: 20px; }
                            .subscription-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
                            .subscription-name { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
                            .subscription-details { margin-top: 10px; font-size: 16px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Thank You for Your Subscription, ${name}!</h1>
                            <div class="subscription-card">
                                <div class="subscription-name">${subscriptionName}</div>
                                <div class="subscription-details">
                                    <div>Cost: ${cost}</div>
                                    <div>Frequency: ${frequency}</div>
                                </div>
                                <div>Now Active ✓</div>
                            </div>
                            <p>We are thrilled to have you as a subscriber of ${subscriptionName}.</p>
                            <p>Your subscription is now active, and you can start enjoying all the benefits it offers.</p>
                            <p>If you have any questions or need assistance, please do not hesitate to contact us.</p>
                        </div>
                    </body>
                </html>
            `,
            name,
            cost,
            frequency
        };
    }

    static subscriptionCancelled(name: string, subscriptionName: string): { subject: string; html: string } {
        return {
            subject: `Subscription Cancellation Confirmation for ${subscriptionName}`,
            html: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                            h1 { color: #95a5a6; margin-bottom: 20px; }
                            .cancellation-notice { background: #f8f9fa; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; }
                            .feedback-box { background: #e8f5e8; border: 1px solid #c3e6c3; padding: 15px; border-radius: 5px; margin: 20px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Subscription Cancellation Confirmation</h1>
                            <p>Dear ${name},</p>
                            <div class="cancellation-notice">
                                <p><strong>${subscriptionName}</strong> subscription has been cancelled successfully.</p>
                            </div>
                            <p>We are sorry to see you go, and we hope to serve you again in the future.</p>
                            <div class="feedback-box">
                                <p>If you have any feedback or questions, please feel free to reach out to us.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };
    }

    static paymentMethodAdded(name: string, paymentMethod: string): { subject: string; html: string } {
        return {
            subject: `Payment Method Added Successfully`,
            html: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                            h1 { color: #16a085; margin-bottom: 20px; }
                            .payment-card { background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
                            .payment-method { font-weight: bold; font-size: 18px; }
                            .success-icon { background: #27ae60; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1><span class="success-icon">✓</span>Payment Method Added Successfully</h1>
                            <p>Dear ${name},</p>
                            <div class="payment-card">
                                <div class="payment-method">${paymentMethod}</div>
                                <div>Successfully Added</div>
                            </div>
                            <p>Your payment method has been added successfully to your account.</p>
                            <p>You can now use this payment method for your future transactions.</p>
                            <p>If you have any questions or concerns regarding your payment method, please feel free to contact us.</p>
                        </div>
                    </body>
                </html>
            `
        };
    }

    static verifyPhone(name: string, code: string): { message: string } {
        return {
            message: `Hello ${name}, your verification code is ${code}. Please enter this code to verify your phone number.`
        };
    }
}
