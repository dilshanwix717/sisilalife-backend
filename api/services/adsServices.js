const {susilaLifeDB} = require("../common/firebaseInit");
const executeGetAdsForTheCountry = async () => {
    const dataList = [];
    try {

        const adsDocRef = susilaLifeDB.collection('ads')
            .where("country", "array-contains", "Sri Lanka");

        const snapshot = await adsDocRef.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
        });
        return dataList;
    } catch (e) {
        console.error("Error executing getAllInquiries:", e);
        return { e };
    }

}
module.exports = { executeGetAdsForTheCountry}