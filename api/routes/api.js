const express = require("express");
const router = express.Router();

const PaymentsGenie = require("../controllers/payment_genie");
const PaymentsDirect = require("../controllers/payment_directpay");
const PaymentsSwirepay = require("../controllers/payment_swirepay");
const User = require("../controllers/user");
const PromoCode = require("../controllers/promocode");
const TimeBasedViewCount = require("../Schedules/TimeBasedViewCount");
const Analytics = require("../controllers/analytics");
const Inquiries = require("../controllers/inquiries");
const Revenue = require("../controllers/revenue");
const Subscription = require("../controllers/subscription");
const Cron = require("../Schedules/revenueCalculationCron")
const { logger } = require("../utils/logger");
const Playlist = require("../controllers/playList");

router.post("/payment_gateway", logger, PaymentsGenie.create);
router.options("/payment_success", logger, PaymentsGenie.success);
router.post("/getPayment/:id", logger, PaymentsGenie.get_payment);
router.delete("/deleteUserById/:id", logger, User.deleteUserByID);

// router.delete('/deleteuserbyid', User.deleteUserByID)
router.post("/createUser", logger, User.createUser);
// router.post('/adminNotification/:id',User.adminNotification)

router.post("/getPromoCodes", logger, PromoCode.sendPromoCodes);
router.post("/setPromoCodes", logger, PromoCode.createPromoCodesForPoolFunc);
router.post("/getTransaction/:id", logger, PromoCode.getTransactionData);

//directpay-ipg
router.post("/payment_direct", logger, PaymentsDirect.create);

//swirepay-ipg
router.post("/payment_swirepay", logger, PaymentsSwirepay.create);
router.post("/payment_swirepay/success", logger, PaymentsSwirepay.success);

//ViewCounts
router.post("/updateViewCounts", logger, TimeBasedViewCount.UpdateViewCounts);

// Analytics
router.post("/analytics", logger, Analytics.getAnalyticsData);

//revenue
router.post("/revenue/paymentRequest", logger, Revenue.updateRequestPayment);
router.post("/revenue/get-revenue-data-by-content-provider", logger, Revenue.getRevenueDataByContentProvider);
router.post("/revenue/get-all-revenue-data", logger, Revenue.getAllRevenueData);
router.post("/revenue/get-all-subscriptionHistory", logger, Revenue.getAllSubscriptionHistory);
router.post("/revenue/schedule-calculation", logger, Revenue.scheduleRevenueCalculator);
router.post("/revenue/get-revenue-and-content-provider-data", logger, Revenue.getRevenueAndContentProviderData);
router.post("/revenue/change-payment-request-status", logger, Revenue.changeRequestPaymentStatus);
router.post("/revenue/get-all-notification-data", logger, Revenue.getAllNotificationData);

// Inquiries
router.post("/inquiry", logger, Inquiries.getAllInquiries);
router.post("/inquiry/reply/:id", logger, Inquiries.sendReplyToInquiry);

//Playlist
router.post("/playList/create-playlist", logger, Playlist.createPlayList);
router.post("/playList/delete-Playlist", logger, Playlist.deletePlayList);
router.post("/playList/add-song-to-playlist", logger, Playlist.addSongToPlaylist);
router.post("/playList/remove-song-from-playlist", logger, Playlist.removeSongFromPlaylist);
router.post("/playList/add-favourite", logger, Playlist.addSongToFavourite);
router.post("/playList/remove-favourite", logger, Playlist.removeSongFromFavourite);

// Test Route
// router.get("/test", logger, Inquiries.testRoute);
//manual cron run
router.post("/manual-cron", logger, Cron.scheduleRevenueCalculationHandler);

//subscription
router.post("/subscription/update-user-subscriptionHistory", logger, Subscription.updateUserSubscriptionHistory);
router.post("/subscription/create-subscription-checkout", Subscription.createSubscriptionCheckout);
router.post("/subscription/update-user-subscriptionHistory", logger, Subscription.updateUserSubscriptionHistory);
router.post("/subscription/payment-success", Subscription.paymentSuccess);
router.post("/subscription/cancel-subscription", Subscription.cancelSubscription);


module.exports = router;

