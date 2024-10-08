const axios = require("axios");

/// swirepay live config
const baseUrl = "https://api.swirepay.com/v1/checkout-page ";
const authenticationCode = "sk_live_yky0KfDyEh361ZyjKje5GpyzUtuANaWn";

/// swirepay test config
// const redirectUrl = "https://susila-life-test.firebaseapp.com/#/success";
// const authenticationCode = "pk_test_5CiWc6P5D92bGdj9x6L4FPH67aUMOG0m";
// const authenticationCode = "sk_test_lUXs0e8jU9MrB9ZTnYOxldxPwr6SHQjc";

const baseGidUrl = "https://api.swirepay.com/v1/checkout-page/";
const redirectUrl = "https://www.slflicks.com/landing/Gvi9";
const {
  susilaLifeDB: db,
  susilaLifeContentProviderDB: cppDatabase,
} = require("../common/firebaseInit");

exports.create = (req, res, next) => {

  const userUid = req.body.userUid;
  const subscriptionPlan = req.body.subscriptionPlan;
    let amount;

  if(subscriptionPlan === "Monthly") {
        //400
      amount = 400;
  } else if (subscriptionPlan === "3 Months") {
      //1200
      amount = 1200;
  } else if (subscriptionPlan === "6 Months") {
      //2000
      amount = 2000;
  } else {
      //4000
      amount = 4000;
  }

  const body = {
    amount: amount,
    currencyCode: "USD",
    sessionTimeout: 200,
    paymentMethodType: ["CARD"],
    redirectUri: redirectUrl,
    serverCallbackUrl:
      "https://susilalife-node-backend.vercel.app/api/payment_swirepay/success",
    meta: {
      userUid: userUid,
      subscriptionPlan: subscriptionPlan, // added the subscription plan for the subscription history
    },
  };

  const headers = {
    "x-api-key": authenticationCode,
    "Content-Type": "application/json",
  };

  axios
    .post(baseUrl, body, { headers })
    .then((response) => {
      console.log("Response:", response.data);
      const bodyRes = JSON.stringify(response.data);
      if (body != null) {
        res.status(201).json(bodyRes);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(501).json({
        error,
      });
    });
};

exports.success = async (req, res, next) => {
  const headers = {
    "x-api-key": authenticationCode,
    "x-secure": 164,
    "Content-Type": "application/json",
  };

  const currentUserUid = req.body.meta.userUid;
  const currentUserGid = req.body.gid;
  const receiptNumber = req.body.paymentSession.receiptNumber;
  const subscriptionPlan = req.body.meta.subscriptionPlan;

  // console.log(`currentUserUid: ${currentUserUid}`);
  // console.log(`currentUserGid: ${currentUserGid}`);
  // console.log(`receiptNumber: ${receiptNumber}`);

  // console.log("swirepay response ===> ", req.body.meta);
  console.log("swirepay response body ===> ", req.body);

  await axios
    .get(baseGidUrl + currentUserGid + "/verify", { headers })
    .then((response) => {
      console.log("Response: ---> ", response.data);
      const bodyRes = JSON.stringify(response.data);
      const bodyData = response.data;
      const userRef = db.collection("users").doc(currentUserUid);

      if (!currentUserUid) {
        return res.status(401).send("Unauthorized");
      }

      if (bodyData["status"] === "SUCCESS") {
        const subscriptionStatus = true;
        const subscriptionOnlineStatus = "SUCCESS";

        return userRef
          .get()
          .then((doc) => {
            if (!doc.exists) {
              throw new Error("User document not found");
            }

            const subscription = doc.data().subscription;
            if (
              !subscription ||
              !Array.isArray(subscription) ||
              subscription.length < 1
            ) {
              throw new Error("Invalid subscription data");
            }

            subscription[0].status = subscriptionStatus;
            subscription[0].subscriptionOnlineStatus = subscriptionOnlineStatus;
            subscription[0].receiptNumber = receiptNumber;

            return userRef.update({ subscription });
          })
          .then(async () => {
            console.log("User subscription status updated successfully.");
            // return res.status(200).send('Subscription status updated successfully.');
            await updateSubscriptionHistory({
              userId: currentUserUid,
              subscriptionType: subscriptionPlan,
            });
          })
          .catch((error) => {
            console.error("Error updating user subscription:", error);
            // return res.status(500).send('Error updating user subscription.');
          });
      } else {
        const subscriptionStatus = false;
        const subscriptionOnlineStatus = "TERMINATED";

        return userRef
          .get()
          .then((doc) => {
            if (!doc.exists) {
              throw new Error("User document not found");
            }

            const subscription = doc.data().subscription;
            if (
              !subscription ||
              !Array.isArray(subscription) ||
              subscription.length < 1
            ) {
              throw new Error("Invalid subscription data");
            }

            subscription[0].status = subscriptionStatus;
            subscription[0].subscriptionOnlineStatus = subscriptionOnlineStatus;

            return userRef.update({ subscription });
          })
          .then(async () => {
            console.log("User subscription status updated successfully.");
            // return res.status(200).send('Subscription status updated successfully.');
            await updateSubscriptionHistory({
              userId: currentUserUid,
              subscriptionType: subscriptionPlan,
            });
          })
          .catch((error) => {
            console.error("Error updating user subscription:", error);
            // return res.status(500).send('Error updating user subscription.');
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(501).json({
        error,
      });
    });
};

// exports.updateSubscriptionHistory = async (req, res, next) => {
async function updateSubscriptionHistory({ userId, subscriptionType }) {
  // // TODO - change these variables to get it from function call
  // const userId = "2ZhUHYldvGL488NuEmYq";
  // const subscriptionType = "Annual";

  const subscriptionMap = {
    Monthly: 1,
    "3 Months": 3,
    "6 Months": 6,
    Annual: 12,
  };

  // from susila mobile db
  const collectionName = "subscriptionHistory";

  const subscriptionHistoryDbRef = cppDatabase
    .collection(collectionName)
    .doc(userId);

  subscriptionHistoryDbRef
    .get()
    .then((dataSnaphot) => {
      try {
        const monthArray = generateMonthsArray(
          subscriptionMap[subscriptionType]
        );
        if (dataSnaphot.exists) {
          // const data = dataSnaphot.data();
          let toSaveData = {};
          for (let index = 0; index < monthArray.length; index++) {
            toSaveData[element] = true;
          }
          console.log(toSaveData);
          subscriptionHistoryDbRef
            .update(toSaveData)
            .then(() => {
              console.log(`New entity for month ${month} created.`);
            })
            .catch((error) => {
              console.error("Error creating a new entity:", error);
            });
        } else {
          // ! When the record is not available at all
          console.log("No record available, Creating new record!");
          let toSaveData = {};
          for (let index = 0; index < monthArray.length; index++) {
            const element = monthArray[index];
            toSaveData[element] = true;
          }
          cppDatabase
            .collection(collectionName)
            .doc(userId)
            .set(toSaveData)
            .then(() => {
              console.log("New record created successfully.");
            })
            .catch((error) => {
              console.log("Failed to create new record.");
            });
        }
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
}

function generateMonthsArray(subscriptionDuration) {
  const months = [];

  if (!isNaN(subscriptionDuration) && subscriptionDuration > 0) {
    const currentMonth = new Date().getMonth() + 1; // Get the current month as a number (1-12)
    const currentYear = new Date().getFullYear(); // Get the current year

    for (let i = 0; i < subscriptionDuration; i++) {
      // Calculate the next month, looping back to January if needed
      const month = ((currentMonth + i - 1) % 12) + 1;
      // Adjust the year accordingly (only if the current month is December)
      const year = currentYear + Math.floor((currentMonth + i - 1) / 12);

      // Format the month as "YYYY-MM" and add it to the array
      const monthString = `${year}-${month.toString().padStart(2, "0")}`;
      months.push(monthString);
    }
  }

  return months;
}
