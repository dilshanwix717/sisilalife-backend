const cron = require("node-cron");
const {
  susilaLifeDB: db,
  susilaLifeContentProviderDB: db2,
} = require("../common/firebaseInit");
const {
  calculateRevenueByContentProviderId,
} = require("../utils/revenueCalculator");

const getAllContentProviders = async () => {
  const contentProviderRef = db.collection("contentProvider");
  const querySnapshot = await contentProviderRef.get();

  const contentProviders = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    contentProviders.push({ id: doc.id, ...data });
  });

  return contentProviders;
};

async function scheduleRevenueCalculation() {
  // ! Step - 01 -> Get all the contenet providers

  // cron.schedule("*/5 * * * * *", async function () {
  // cron.schedule("59 23 L * *", async function () {
  // cron.schedule("0 0 */30 * *", async function () {
  cron.schedule("0 23 28-31 * *", async function () {
    try {
      const contentProvidersList = await getAllContentProviders();

      for (let i = 0; i < contentProvidersList.length; i++) {
        const contentProvider = contentProvidersList[i];
        // console.log(contentProvider);
        const contentProviderId = contentProvider.id;
        // write the code here to get the revenue monthly
        // TODO:  need to add more validation to save and process both past and future records
        // Can break the complex code to more, by splititng up the code is analytics.js,
        // by defining single function for each revene model type.
        await calculateRevenueByContentProviderId(contentProviderId);
      }
    } catch (error) {
      console.error("Error creating revenue: ", error);
    }
  });
}



module.exports = { scheduleRevenueCalculation };
