const {
    susilaLifeDB,
    susilaLifeFirebaseApp,
} = require("../common/firebaseInit");
const usersCollection = susilaLifeDB.collection("users");
const referralCollection = susilaLifeDB.collection("referral");

const executeGetReferralNumbers = async () => {

    try {
        let dataResult = [];
        const querySnapshot = await referralCollection
            .get().then((value) => {
                dataResult = value.docs.map((e) => e.data());
            })

        return dataResult;
    } catch (e) {
        console.error("Error executing getAllInquiries:", e);
        return { e }; // Return an empty object in case of an error
    }
}

module.exports = { executeGetReferralNumbers }