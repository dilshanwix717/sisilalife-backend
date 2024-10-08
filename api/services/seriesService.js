const {
    susilaLifeDB,
    susilaLifeFirebaseApp,
} = require("../common/firebaseInit");
const {CategoryIDS} = require("../common/constants");
const seriesCollection = susilaLifeDB.collection("series");

const executeGetASeriesData = async (id) => {
    const dataList = [];
    try {
        const query = seriesCollection
        .where("id", "==", id);

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
        });
        console.log("executeGetASeriesData===============>>>>", dataList);
        return dataList;
    } catch (e) {
        console.error("Error executing getAllInquiries:", e);
        return { e }; 
    }
}
const executeGetASeriesDataByTitle = async (title) =>{
    const dataList =[];
    try {
        const query = seriesCollection
        .where("title", "==", title);

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
        })
        // console.log("executeGetASeriesDataByTitle===============>>>>", dataList);
        return dataList;
    } catch (e) {
        console.error("Error executing getAllInquiries:", e);
        return { e };
    }
}


const executeSetAFavouriteSeries = async (userId,seriesId,categoryId) => {
    let collectionName = 'webSeries';
    try {
       if (categoryId === 'Web Series') {
            collectionName = 'webSeries'}
       else {
            collectionName = 'series'
        }
            // } else if (categoryId === CategoryIDS.cookeryId){
        //     collectionName = 'cookerySeries'
        // } else if (categoryId === CategoryIDS.discussionId){
        //     collectionName = 'discussionsSeries'
        // } else if (categoryId === CategoryIDS.musicId) {
        //     collectionName = 'musicVideoSeries'
        // }else if (categoryId === CategoryIDS.podcastId){
        //         collectionName = 'podcastSeries'
        // }else if (categoryId === CategoryIDS.realityShowId){
        //     collectionName = 'realityShowsSeries'
        // }else if (categoryId === CategoryIDS.travelId){
        //     collectionName = 'travelSeries'}

        const seriesDocRef = susilaLifeDB.collection(collectionName).doc(seriesId);
        const docSnapshot = await seriesDocRef.get();

        if (!docSnapshot.exists) {
            throw new Error("Favourite document not found.");
        }

        const existingData = docSnapshot.data();
        const favouritesArray = existingData.favourite_user || [];

        const favSongsList = favouritesArray || [];

        if (favSongsList.some(item => item === userId)) {
            const userIndex = favouritesArray.indexOf(userId);

            if (userIndex === -1) {
                throw new Error(`Song with id ${userId} does not exist in the playlist.`);
            }
            favouritesArray.splice(userIndex, 1);
        } else {
            favouritesArray.push(userId);
        }

        await seriesDocRef.update({
            favourite_user: favouritesArray
        });
        console.log("User  favourite  changed successfully!");
    } catch (error) {
        console.error("Error executing executeAddSongToFavourite:", error);
        throw error;
    }
}

const executeGetAFavouriteSeries = async (userId,seriesId,categoryId) => {
    let collectionName = 'webSeries';
    const dataList = [];
    try {
        if (categoryId === 'Web Series') {
            collectionName = 'webSeries'}
        else {
            collectionName = 'series'
        }

        const seriesDocRef = susilaLifeDB.collection(collectionName)
            .where("id", "==", seriesId);

        const snapshot = await seriesDocRef.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
        });
        console.log("executeGetASeriesData===============>>>>", dataList);
        return dataList;
    } catch (e) {
        console.error("Error executing getAllInquiries:", e);
        return { e };
    }

}


module.exports = { executeGetASeriesData, executeGetASeriesDataByTitle,executeSetAFavouriteSeries,executeGetAFavouriteSeries}
