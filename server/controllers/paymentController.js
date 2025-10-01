import {
    ApiError,
    Client,
    Environment,
    LogLevel,
    OrdersController,
} from "@paypal/paypal-server-sdk";
import axios from "axios";
import stripe from "stripe";
import dotenv from 'dotenv';
dotenv.config();

const stripeGateway = process.env.STRIPE_SECRET_KEY 
  ? new stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_CLIENT_ID,
        oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: true },
        logResponse: { logHeaders: true },
    },
});

const ordersController = new OrdersController(client);


export const paypalCreateOrder = async (req, res) => {
    try {
        const { amount, course } = req.body;
        const response = await ordersController.createOrder({
            body: {
                intent: "CAPTURE",
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: "USD",
                            value: amount.toString(),
                            breakdown: {
                                itemTotal: {
                                    currencyCode: "USD",
                                    value: amount.toString(),
                                },
                            },
                        },
                        description: course || "Course Payment",
                    },
                ],
            },
            prefer: "return=minimal",
        })

        res.status(201).json({
            status: "Success",
            data: {
                orderId: response.result.id
            },
            message: "Order Created Successfully"
        })

    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode || 500).json({
                status: "Failure",
                data: error.result || null,
                message: error.result.message,
            });
        }

        return res.status(500).json({
            status: "Failure",
            data: null,
            message: "Something went wrong while creating PayPal order",
        });
    }
};

export const paypalCaptureOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: "orderId is required" });
        }

        const response = await ordersController.captureOrder({
            id: orderId,
            prefer: "return=minimal",
        });

        return res.status(200).json({
            status: "success",
            data: response.result,
            message: "Order Captured Successfully",
        });
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode || 500).json({
                status: "Failure",
                data: error.result || null,
                message: error.result.message,
            });
        }

        return res.status(500).json({
            status: "Failure",
            data: null,
            message: "Something went wrong while capturing PayPal order",
        });
    }
};

export const generateStripePaymentLink = async (req, res) => {
    try {
        const { amount, clientId, course, url } = req.body;

        const response = await stripeGateway.paymentLinks.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course,
                            description: `Enrollment in ${course}`
                        },
                        unit_amount: amount * 100
                    },
                    quantity: 1
                }
            ],
            metadata: {
                client_Id: clientId,
                amount: amount
            },

            after_completion: {
                type: 'redirect',
                redirect: {
                    url: url
                }
            }
        });

        res.status(200).json({
            status: "Success",
            data: response,
            message: "Payment link generated successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: "Failure",
            data: error,
            message: "Internal Server Error"
        });
    }
}

export const receiveStripeWebHook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify webhook signature
        event = stripeGateway.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
        console.log('✅ Webhook signature verified');
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        console, log(event);

        if (event.type == "checkout.session.completed") {
            await axios.patch(`/api/hubspot/update-contact/${contactId}`, {
                properties: {
                    leads_status: "ENROLLED",
                    hs_lead_status: "Enroll",
                    paid_amount: event.object.amount_total,
                    payment_status: "Completed",
                    payment_id: event.object.payment_intent,
                    payment_type: "stripe",
                },
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            res.status(200).json({
                status: "Success",
                data: req.body,
                message: "Payment Success"
            });
            axios.patch()
        } else {
            res.status(500).json({
                status: "Failed",
                data: error,
                message: "Payment Failed"
            });
        }

    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
}


