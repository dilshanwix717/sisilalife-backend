const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const admin = require("firebase-admin");
const serviceAccount = require("../../susila-life-test-firebase-adminsdk-3eph5-f70f6ab24a.json");
const { executeUpdateUserSubscriptionHistory } = require("../services/subscriptionService");

// Ensure these are valid Stripe price IDs from your Stripe dashboard
const [annually, sixMonths, threeMonths, monthly] = ['price_1Q6bWRRvuSmNKnJA9RbZ3Owh', 'price_1Q6bVuRvuSmNKnJAjTOelneT', 'price_1Q6bVTRvuSmNKnJABQw2ksBw', 'price_1Q6bUwRvuSmNKnJA4K87f08P'];

// Plan names corresponding to each price ID
const planNames = {
    [annually]: 'Annual',
    [sixMonths]: '6 Months',
    [threeMonths]: '3 Months',
    [monthly]: 'Monthly',
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const stripeSession = async (plan) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: plan, // This needs to be a valid Stripe price ID
                    quantity: 1
                },
            ],
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        });
        return session;
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        throw new Error("Failed to create Stripe session.");
    }
};

const createSubscriptionCheckout = async (req, res) => {
    const { plan, customerId } = req.body;
    let planId = null;

    if (plan == 40) planId = annually;
    else if (plan == 20) planId = sixMonths;
    else if (plan == 12) planId = threeMonths;
    else if (plan == 4) planId = monthly;

    // Log the planId to ensure it is being set correctly
    console.log("Selected Plan ID:", planId);

    try {
        if (!planId) {
            throw new Error("Invalid plan ID. Please check the plan selection.");
        }

        // Fetch the user's details from Firebase Auth
        const user = await admin.auth().getUser(customerId);

        // Reference to user's Firestore document
        const userDocRef = admin.firestore().collection("webAppUsers").doc(user.uid);
        const userDocSnap = await userDocRef.get();

        let stripeCustomerId;

        // Check if the user already has a Stripe customer ID stored
        if (userDocSnap.exists && userDocSnap.data().stripeCustomerId) {
            stripeCustomerId = userDocSnap.data().stripeCustomerId;
        } else {
            // Create a new Stripe customer if one doesn't exist
            const customer = await stripe.customers.create({
                email: user.email,
                name: `${user.displayName}`,
                metadata: {
                    firebaseUID: user.uid,
                },
            });

            // Store the Stripe customer ID in Firestore
            await userDocRef.update({
                stripeCustomerId: customer.id,
            });

            stripeCustomerId = customer.id;
        }

        // Create a Stripe session
        const session = await stripeSession(planId);

        // Log session to debug if session.id is undefined
        console.log("Stripe session:", session);
        if (!session || !session.id) {
            throw new Error("Stripe session ID is undefined.");
        }

        // Get the plan name using the planId
        const planTypeName = planNames[planId];

        // Update the subscription details in Firestore with plan name
        await userDocRef.update({
            subscription: {
                sessionId: session.id,
                startDate: admin.firestore.FieldValue.serverTimestamp(),
            }
        });

        // Return the session information to the frontend
        return res.json({ session });
    } catch (error) {
        console.error("Error creating subscription checkout:", error.message);
        res.status(500).send({ error: error.message });
    }
};


/************ payment success ********/
const paymentSuccess = async (req, res) => {
    const { sessionId, firebaseId } = req.body;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
            const subscriptionId = session.subscription;
            try {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const user = await admin.auth().getUser(firebaseId);
                const planId = subscription.plan.id;
                // Map the plan ID to the corresponding plan name
                const planType = planNames[planId];

                const startDate = moment.unix(subscription.current_period_start).format('YYYY-MM-DD');
                const endDate = moment.unix(subscription.current_period_end).format('YYYY-MM-DD');
                const durationInSeconds = subscription.current_period_end - subscription.current_period_start;

                // Update the Firestore database (webAppUsers collection)
                const userDocRef = admin.firestore().collection("webAppUsers").doc(user.uid);

                // Update the subscription details in Firestore with plan name
                await userDocRef.update({
                    subscription: {
                        sessionId: null,
                        planId: planId,
                        planType: planType,
                        planStartDate: startDate,
                        planEndDate: endDate,
                        subscriptionId: subscriptionId,
                        status: 'active',
                    }
                });
            } catch (error) {
                console.error('Error retrieving subscription:', error);
            }
            return res.json({ message: "Payment successful" });
        } else {
            return res.json({ message: "Payment failed" });
        }
    } catch (error) {
        res.send(error);
    }
};

const cancelSubscription = async (req, res) => {
    const { customerId } = req.body;
    try {
        // Fetch the user's details from Firebase Auth
        const user = await admin.auth().getUser(customerId);

        // Reference to user's Firestore document
        const userDocRef = admin.firestore().collection("webAppUsers").doc(user.uid);
        const userDocSnap = await userDocRef.get();

        // Check if the user document exists
        if (userDocSnap.exists) {  // Corrected: 'exists' is a property, not a function
            const userData = userDocSnap.data();
            const subscriptionId = userData.subscription.subscriptionId;

            // Cancel the subscription
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true,
            });

            // Update the subscription details in Firestore
            await userDocRef.update({
                "subscription.status": 'cancelled',  // Use the correct field update notation
            });

            return res.json({ message: "Subscription cancelled successfully" });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        return res.status(500).json({ error: "Failed to cancel subscription" });
    }
};



const updateUserSubscriptionHistory = async (req, res, next) => {
    const userID = req.body.userId
    const subscriptionPlan = req.body.subscriptionPlan
    console.log('print userId inside body ====>', userID);
    console.log('print subscriptionPlan inside body ====>', subscriptionPlan);
    try {
        const data = await executeUpdateUserSubscriptionHistory(
            userID,
            subscriptionPlan
        );
        res.status(200).json(data);
        console.log(req.body)
    } catch (error) {
        console.error("Error getting documents:", error);
        res.status(500).json({
            status: "500",
            error: error.message,
        });
    }
};

module.exports = {
    updateUserSubscriptionHistory,
    createSubscriptionCheckout,
    paymentSuccess,
    cancelSubscription
};

