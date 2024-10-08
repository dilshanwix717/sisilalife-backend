const {
    susilaLifeDB: db,
    susilaLifeContentProviderDB: cppDatabase,
} = require("../common/firebaseInit");
async function executeUpdateUserSubscriptionHistory( userID, subscriptionPlan ){
    // // TODO - change these variables to get it from function call
    // const userID = "2ZhUHYldvGL488NuEmYq";
    // const subscriptionPlan = "Annual";
    console.log('print userId ====>',userID);
    console.log('print subscriptionPlan ====>',subscriptionPlan);

    const subscriptionMap = {
        Monthly: 1,
        "3 Months": 3,
        // "6 Months": 6,
        Annual: 12,
    };

    // from susila mobile db
    const collectionName = "subscriptionHistory";

    const subscriptionHistoryDbRef = cppDatabase
        .collection(collectionName)
        .doc(userID);

    subscriptionHistoryDbRef
        .get()
        .then((dataSnaphot) => {
            try {
                const monthArray = generateMonthsArrayForUser(
                    subscriptionMap[subscriptionPlan]
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
                        .doc(userID)
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
function generateMonthsArrayForUser(subscriptionDuration) {
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



module.exports = {executeUpdateUserSubscriptionHistory};
