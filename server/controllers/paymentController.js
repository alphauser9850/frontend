import {
    ApiError,
    Client,
    Environment,
    LogLevel,
    OrdersController,
} from "@paypal/paypal-server-sdk";
import stripe from "stripe";
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, STRIPE_SECRET_KEY } from "../env.js";

const stripeGateway = new stripe(STRIPE_SECRET_KEY);


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

export const createStripeIntent = async (req, res) => {
    try {
        const { amount, course } = req.body;

        // Validate required fields
        if (!amount || !course) {
            return res.status(400).json({
                status: "Failure",
                message: "Amount and course are required"
            });
        }

        const paymentIntent = await stripeGateway.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents and ensure integer
            currency: "usd",
            automatic_payment_methods: { enabled: true }, // Remove duplicate line
            description: course,
            metadata: {
                course: course
            }
        });

        res.status(200).json({
            status: "Success",
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            },
            message: "PaymentIntent created successfully"
        });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({
            status: "Failure",
            error: error,
            message: "Internal Server Error",
        });
    }
};