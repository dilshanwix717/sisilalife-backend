const {susilaLifeDB} = require("../common/firebaseInit");

const executeGetContentProviderProfilesForId = async (id) => {
    const dataList = [];
    try {
        const DocRef = susilaLifeDB.collection('contentProvider')
            .where("id" == id);

        const snapshot = await DocRef.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
        });
        console.log("executeGetContentProviderProfilesForId========>>>>", dataList);
        return dataList;
    } catch (e) {
        console.error("Error executing getAllInquiries:", e);
        return { e };
    }
}

module.export={executeGetContentProviderProfilesForId}