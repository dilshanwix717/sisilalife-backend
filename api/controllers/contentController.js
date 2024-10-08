const {susilaLifeDB} = require("../common/firebaseInit");
const {executeGetReferralNumbers} = require("../services/contentService");
const usersCollection = susilaLifeDB.collection("users");
const referralCollection = susilaLifeDB.collection("referral");
const isTimestampPastNDays = require("../common/comonFunction");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const { FieldPath } = require('firebase-admin').firestore;
const {
    susilaLifeDB: db,
  } = require("../common/firebaseInit");
const {CategoryIDS} = require("../common/constants");

exports.testGet = (req, res, next) => {
    res.status(301).json({
        status: "SUCCESS",
        message: "TEST SUCCESS",
    });
}

exports.getReferralNumbers = async (req, res, next) => {

    try {
        const data = await executeGetReferralNumbers();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(401).json(e)
    }

};

exports.getContentForTheChip = async(req, res) => {
    const dataList = [];
    const category= req.body.category;
    const categoryID= req.body.categoryID;

    try {

        if(category === "")
            return res.status(401).json("Category required")

        if(categoryID === "")
            return res.status(401).json("CategoryId required")
        
        if (category == "Music") {
            const query = db.collection("content")
            .where("categoryID", "==", categoryID)
            .where("musicType", "==", "Video");
        
            const snapshot = await query.get();
            snapshot.forEach((doc) => {
                dataList.push(doc.data());
                // console.log("dataList Music=====>>>", dataList);
            });
        } else {
            const query = db.collection("content")
            .where("category", "==", category)
            .where("categoryID", "==", categoryID);
            
            const snapshot = await query.get();
            snapshot.forEach((doc) => {
                dataList.push(doc.data());
                // console.log("dataList Other=====>>>", dataList);
            });
        }
        return res.status(200).json({
            data: dataList,
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
        return res.status(500).json({ message: "Error getting documents" });
    }
    // return dataList;
}

// exports.getLatestUploads = async(req, res) => {
//     const dataList = [];
//     try {
//         const query = db.collection("content")
//         .orderBy("createAt", "desc")
//         .limit(10);

//         const snapshot =await query.get();
//         snapshot.forEach((doc) => {
//             dataList.push(doc.data());
//             console.log("Lates Uploads List===>>>", dataList);
//         });
//     } catch (error) {
//         console.error("Error getting documents: ", error);
//         return res.status(500).json({ message: "Error getting documents" });
//     }
//     return dataList;
// }

exports.getLatestItemsForCategories = async (req, res) => {
    const dataList = [];

    // Iterate over the values of CategoryIDS
    for (const categoryId of Object.values(CategoryIDS)) {
        // skip these
        if (categoryId === CategoryIDS.podcastId) {
            continue;
        }

        try {
            if (categoryId === CategoryIDS.teledramaId) { // category = Travel
                const query = db.collection('series')
                    .orderBy("createAt", "desc")
                    .limit(2);

                const snapshot = await query.get();
                snapshot.forEach((doc)=>{
                    dataList.push(doc.data());
                    // console.log("Travel List======>>>", dataList);
                });
            } else if(categoryId === CategoryIDS.musicId){
                const query = db.collection("content")
                    .where("musicType", "==", "Video")
                    .orderBy("createAt", "desc")
                    .limit(2);

                const snapshot = await query.get();
                snapshot.forEach((doc) => {
                    dataList.push(doc.data());
                    // console.log("Music List======>>>", dataList);
                })
            } else {
                const query = db.collection("content")
                    .where("categoryID", "==", categoryId)
                    .orderBy("createAt", "desc")
                    .limit(2);

                const snapshot = await query.get();
                snapshot.forEach((doc) =>{
                    dataList.push(doc.data());
                    // console.log("Other data List======>>>", dataList);
                });
            }
        } catch (error) {
            console.error("Error getting documents: ", error);
            continue;
        }
    }
    console.log('len===>',dataList.length);
    return res.status(200).json({
        data: dataList,
    });
}

exports.getFeaturedTeleseries = async( req, res) => {
    const dataList = [];
    const featuredContent= true;
    const displayFeaturedContent= "Tele-series";
    try {
        const query = await db.collection("series")
        .where("featuredContent", "==", featuredContent)
        .where("displayFeaturedContent", "==", displayFeaturedContent)
        .orderBy("createAt", "desc")
        .get();

        // console.log("Inside the function  ===============>>>", query.docs.map((doc) => doc.data()));
        const response =  query.docs.map((doc) => {
            // console.log("Query execute  ===============>>>" );
            dataList.push(doc.data());
            // console.log("getFeaturedTeleseries ===============>>>",dataList );
        });
        return res.status(200).json({
            data: dataList,
        });
        // return dataList;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return res.status(500).json({ message: "Error getting documents" });
    }
}

exports.getSusilaOriginals = async(req, res) => {
    const dataList= [];

    try {
        console.log("Inside the function  ===============>>>" );
        const query = db.collection("series")
        .where("contentProvider", "==", "tzUubgYgewJacpwAdLxi")
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("susila originals===========>>>>>>", dataList);
        })
        return res.status(200).json({
            data: dataList,
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
        return res.status(500).json({ message: "Error getting documents" });
    }
}

exports.getHighlights = async(req, res) => {
    const dataList = [];

    try {
        console.log("Inside the function  ===============>>>" );
        const query = db.collection("shorts").orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("getHighlights===============>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });
        
    } catch (error) {
        console.error("Error getting documents: ", error);
        return res.status(500).json({ message: "Error getting documents" });
    }
}

exports.getBanners = async(req, res) => {
    const dataList = [];

    try {
        // console.log("Inside the function  ===============>>>" );
        const query = db.collection("banner").orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("getBanners List ======>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting documents: ", error);
        return res.status(500).json({ message: "Error getting documents" });
    }
}

exports.getSeasonVolume = async (req, res) => {
    const dataList=[];
    // const title = req.body.title;
    const title= req.query.title;

    try {
        const query = db.collection("content")
        .where("title", "==", title)
        .orderBy("createAt", "desc");

        const snapshot= await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            console.log("getSeasonVolume List =====>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
        return res.status(500).json({ message: "Error getting documents" });
    }
}

exports.getContentByTitleAndSeasonData = async (req, res)=> {
    const dataList=[];
    // const title= req.body.title;
    // const season= req.body.season;

    const title= req.query.title;
    const season= req.query.season;

    console.log("title =====>>>", title);
    console.log("season=====>>>", season);

    try {
        const query =  db.collection("content")
            .where("title", "==", title)
            .where("season", "==", season)
            .orderBy("createAt");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            console.log("Episode   List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getContentProvidersData = async (req, res)=> {
    const dataList=[];
    const contentProvider= req.body.contentProvider;

    try {
        const query =  db.collection("content")
        .where("contentProvider", "==", contentProvider)
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("getContentProvidersData======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });
    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Error getting document"});
    }
}

exports.getSeries = async (req, res)=> {
    const dataList=[];

    try {
        const query =  db.collection("series").orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            // if (isTimestampPastNDays(data.createAt, 60)) {
                dataList.push(data);
            // }
        });
        // console.log("getSeries======>>>>", dataList);

        let isNewContentsAvailable = false;

        if (dataList.length > 0) {
            const firstCreateAtTimestamp = dataList[0].createAt;
            // console.log('print this==>', firstCreateAtTimestamp);
            isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 60);
        }

        return res.status(200).json({
            data: dataList,
            isNewContentsAvailable: isNewContentsAvailable,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

// import isTimestampPastNDays from "../common/commonFunction";

// exports.getSeries = async (req, res) => {
//     const dataList = [];
//
//     try {
//         const query = db.collection("series").orderBy("createAt", "desc");
//
//         const snapshot = await query.get();
//         snapshot.forEach((doc) => {
//             const data = doc.data();
//             if (isTimestampPastNDays(data.createAt, 7)) {
//                 dataList.push(data);
//             }
//         });
//         // console.log("getSeries======>>>>", dataList);
//
//         let isNewContentsAvailable = false;
//         if (dataList.length > 0) {
//             const firstCreateAtTimestamp = dataList[0].createAt;
//             console.log('print this==>', firstCreateAtTimestamp);
//             isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 7);
//         }
//
//         return res.status(200).json({
//             data: dataList,
//             isNewContentsAvailable: isNewContentsAvailable,
//         });
//
//     } catch (error) {
//         console.error("Error getting Document", error);
//         return res.status(500).json({ message: "Error getting document" });
//     }
// };

exports.getSeriesCommon = async (req, res)=> {
    console.log("body =====>" , req)
    const dataList=[];
    const seriesName= req.query.seriesName;
    console.log("series name =====> ",seriesName)

    try {
        const query =  db.collection(seriesName).orderBy("createAt");
        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            console.log("getSeriesCommon  List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getASeries = async (req, res)=> {
    const dataList=[];
    title= req.body.title;

    try {
        const query =  db.collection("series")
        .where("title", "==", title)
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            console.log("getASeries  List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getASeriesBySeriesId = async (req, res)=> {
    const dataList=[];
    id = req.body.id;
    category = req.body.category;
    console.log('pring body===>',req.body);
    console.log('pring body id ===>',req.body.id);
    console.log('pring body===>',req.body.category);
    try {
        if(category == 'Teledrama') {
            const query = db.collection("series")
                .where("id", "==", id)
                .orderBy("createAt", "desc");
            const snapshot =   await query.get();
            snapshot.forEach((doc) => {
                dataList.push(doc.data());
                console.log("getASeriesBySeriesId  List======>>>>", dataList);
            });
        } else if(category == 'Web Series'){
            const query = db.collection("webSeries")
                .where("id", "==", id)
                .orderBy("createAt", "desc");
            const snapshot =   await query.get();
            snapshot.forEach((doc) => {
                dataList.push(doc.data());
                console.log("getASeriesBySeriesId  List======>>>>", dataList);
            });
        } else{
            const query = db.collection("series")
                .where("id", "==", id)
                .orderBy("createAt", "desc");
            const snapshot =   await query.get();
            snapshot.forEach((doc) => {
                dataList.push(doc.data());
                console.log("getASeriesBySeriesId  List======>>>>", dataList);
            });
        }

        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getComedy = async (req, res)=> {
    const dataList=[];
    try {
        console.log("getComedy ======>>>>");
        const query =  db.collection("content")
        .where("category", "==", "Comedy")
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            // if (isTimestampPastNDays(data.createAt, 7)) {
                dataList.push(data);
            // }
        });
        // console.log("getComedy  List======>>>>", dataList);

        let isNewContentsAvailable= false;

        if (dataList.length > 0) {
            const firstCreateAtTimestamp = dataList[0].createAt;
            console.log('print this==>',firstCreateAtTimestamp)
            isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 7);
        }
        return res.status(200).json({
            data: dataList,
            isNewContentsAvailable: isNewContentsAvailable,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getMovies = async (req, res)=> {
    const dataList=[];
    try {
        const query =  db.collection("content")
        .where("category", "==", "Movies")
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            // if (isTimestampPastNDays(data.createAt, 7)) {
            //     console.log('pass n days==>')
                dataList.push(data);
            // }
        });
        // console.log("getMovies  List======>>>>", dataList);

        let isNewContentsAvailable = false;
        if (dataList.length > 0) {
            const firstCreateAtTimestamp = dataList[0].createAt;
            console.log('print this==>', firstCreateAtTimestamp);
            isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 7);
        }
        return res.status(200).json({
            data: dataList,
            isNewContentsAvailable: isNewContentsAvailable,
        })

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getMusic = async (req, res)=> {
    const dataList=[];
    try {
        const query =  db.collection("content")
        .where("category", "==", "Music")
        .where("musicType", "==", "Video")
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            // if (isTimestampPastNDays(data.createAt, 7)) {
                dataList.push(data);
            // }
        });
        
        // console.log("getMusic  List======>>>>", dataList);
        let isNewContentsAvailable = false;
        if (dataList.length > 0) {
            const firstCreateAtTimestamp = dataList[0].createAt; 
            console.log('print this==>', firstCreateAtTimestamp);
            isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 7);
        }

        return res.status(200).json({
            data: dataList,
            isNewContentsAvailable: isNewContentsAvailable,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getContentForCategory = async (req, res)=> {
    const dataList=[];
    const category= req.query.category;
    
    try {
        const query =  db.collection("content")
        .where("category", "==", category)
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("getContentForCategory  List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getContentById = async (req, res)=> {
    const dataList=[];
    categoryID= req.body.categoryID;

    try {
        const query =  db.collection("content")
        .where("categoryID", "==", categoryID)
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            // if (isTimestampPastNDays(data.createAt, 7)) {
                dataList.push(data);
            // }
        });
        // console.log("getContentById  List======>>>>", dataList);

        let isNewContentsAvailable = false;
        if (dataList.length > 0) {
            const firstCreateAtTimestamp = dataList[0].createAt; 
            console.log('print this==>', firstCreateAtTimestamp);
            isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 7);
        }
        return res.status(200).json({
            data: dataList,
            isNewContentsAvailable: isNewContentsAvailable,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getCooking = async (req, res)=> {
    const dataList=[];
    categoryID= "GuwGfbcCbwjgtP08b9b1";

    try {
        const query =  db.collection("content")
        .where("categoryID", "==", categoryID)
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            // if (isTimestampPastNDays(data.createAt, 7)) {
                dataList.push(data);
            // }
        });
        // console.log("getCooking  List======>>>>", dataList);

        let isNewContentsAvailable = false;
        if (dataList.length > 0) {
            const firstCreateAtTimestamp = dataList[0].createAt; 
            console.log('print this==>', firstCreateAtTimestamp);
            isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 7);
        }

        return res.status(200).json({
            data: dataList,
            isNewContentsAvailable: isNewContentsAvailable,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getBusiness = async (req, res)=> {
    const dataList=[];
    categoryID= "I2KVNpzu9ByruCEw8xOQ";

    try {
        const query =  db.collection("content")
        .where("categoryID", "==", categoryID)
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            // if (isTimestampPastNDays(data.createAt, 7)) {
                dataList.push(data);
            // }
        });
        // console.log("getCooking  List======>>>>", dataList);

        let isNewContentsAvailable = false;
        if (dataList.length > 0) {
            const firstCreateAtTimestamp = dataList[0].createAt;
            console.log('print this==>', firstCreateAtTimestamp);
            isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 7);
        }

        return res.status(200).json({
            data: dataList,
            isNewContentsAvailable: isNewContentsAvailable,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getStageDrama = async (req, res)=> {
    const dataList=[];
    categoryID= "iB9ehHcq4bF1uHS8E5V1";

    try {
        const query =  db.collection("content")
        .where("categoryID", "==", categoryID)
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            // if (isTimestampPastNDays(data.createAt, 7)) {
                dataList.push(data);
            // }
        });
        // console.log("getCooking  List======>>>>", dataList);

        let isNewContentsAvailable = false;
        if (dataList.length > 0) {
            const firstCreateAtTimestamp = dataList[0].createAt;
            console.log('print this==>', firstCreateAtTimestamp);
            isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 7);
        }

        return res.status(200).json({
            data: dataList,
            isNewContentsAvailable: isNewContentsAvailable,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getDocumentary = async (req, res)=> {
    const dataList=[];
    categoryID= "NcrWKJaojseTRlRKzdBP";

    try {
        const query =  db.collection("content")
        .where("categoryID", "==", categoryID)
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            // if (isTimestampPastNDays(data.createAt, 7)) {
                dataList.push(data);
            // }
        });
        // console.log("getCooking  List======>>>>", dataList);

        let isNewContentsAvailable = false;
        if (dataList.length > 0) {
            const firstCreateAtTimestamp = dataList[0].createAt;
            console.log('print this==>', firstCreateAtTimestamp);
            isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 7);
        }

        return res.status(200).json({
            data: dataList,
            isNewContentsAvailable: isNewContentsAvailable,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getRealityShows = async (req, res)=> {
    const dataList=[];
    categoryID= "dbZ4bxMncb1go7d2xlZt";

    try {
        const query =  db.collection("content")
        .where("categoryID", "==", categoryID)
        .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            // if (isTimestampPastNDays(data.createAt, 7)) {
                dataList.push(data);
            // }
        });
        // console.log("getCooking  List======>>>>", dataList);

        let isNewContentsAvailable = false;
        if (dataList.length > 0) {
            const firstCreateAtTimestamp = dataList[0].createAt;
            console.log('print this==>', firstCreateAtTimestamp);
            isNewContentsAvailable = isTimestampPastNDays(firstCreateAtTimestamp, 7);
        }

        return res.status(200).json({
            data: dataList,
            isNewContentsAvailable: isNewContentsAvailable,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getAllContent = async (req, res)=> {
    const dataList=[];

    try {
        const query =  db.collection("content").orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("getAllContent  List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getContentIterateData = async (req, res)=> {
    const dataList=[];
    const category= req.body.category;
    const title= req.body.title;
    const season= req.body.season;

    try {
        const query =  db.collection("content")
        .where("category", "==", category)
        .where("title", "==", title)
        .where("season", "==", season)
        .orderBy("createAt");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("getContentIterateData  List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getContentSeriesIterateData = async (req, res)=> {
    const dataList=[];
    const category= req.body.category;
    const title= req.body.title;

    try {
        const query =  db.collection("content")
        .where("category", "==", category)
        .where("title", "==", title)
        // .orderBy("createAt")
            .orderBy("episode", "asc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("getContentSeriesIterateData  List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getContentForEpisodeLineUp = async (req, res)=> {
    const dataList=[];
    const category= req.body.category;
    const title= req.body.title;

    try {
        const query =  db.collection("content")
        .where("category", "==", category)
        .where("title", "==", title)
        .orderBy("createAt");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("getContentForEpisodeLineUp  List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.getContentIterateDataForContinueWatching = async (req, res)=> {
    const dataList=[];
    const id= req.body.id;
    try {
        console.log(" Function execute start");
        const query =  db.collection("content")
        .where("id", "==", id);

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("getContentIterateDataForContinueWatching  List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Error getting document"});
    }
}

exports.getContentIterateDataForMyList = async (req, res)=> {
    const dataList=[];
    const id= req.body.id;
    try {
        const query =  db.collection("series")
        .where("id", "==", id);

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            // console.log("getContentIterateDataForMyList  List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}

exports.checkForUserInContentsView = async (req, res, next) => {''
    const dataList= [];
    const contentId = req.body.contentId;
    const userId = req.body.userId;
    const currentYearAndMonth = req.body.currentYearAndMonth;

    if (!contentId || !userId || !currentYearAndMonth) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
    }
    try {
        console.log(`execute checkForUserInContentsView =============>>`);
        const querySnapshot = await db.collection("contentViews")
            .where('id', '==', contentId)
            .where(currentYearAndMonth, 'array-contains', userId)
            .get();

            
            const count = querySnapshot.docs.length;

            console.log(`checkForUserInContentsView =============>>`, dataList);
            console.log(`count =============>>`, count);
        if (count > 0) {
            return res.status(200).json({ success: true, message: "User has viewed the content." });
        } else {
            return res.status(200).json({ success: false, message: "User has not viewed the content." });
        }
    } catch (error) {
        console.error("Error checking document", error);
        return res.status(500).json({ message: "Error checking document" });
    }
}

exports.addViewCount = async (req, res) => {
    const userId = req.body.userId;
    const contentId = req.body.contentId;
    const currentYearAndMonth = req.body.currentYearAndMonth;
    const contentProviderId = req.body.contentProviderId;
    const contentTitle = req.body.contentTitle;
    const category = req.body.category;
    const contentCategoryId = req.body.contentCategoryId;
    const season = req.body.season;
    const episode = req.body.episode;
    
    try {
        if (!userId || !contentId || !currentYearAndMonth || !contentProviderId || !contentTitle || !category || !contentCategoryId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const contentDoc  =  db.collection("contentViews").doc(contentId);

        const updateData = {
            contentProvider: contentProviderId,
            title: contentTitle,
            category: category,
            id: contentId,
            categoryId: contentCategoryId,
            season: season || null,
            episode: episode || null,
        };

        updateData[`${currentYearAndMonth}`] = FieldValue.arrayUnion(userId);

        await contentDoc.set(updateData, { merge: true });

        console.log(`View count for content with ID updated successfully.`);
        return res.status(200).json({ success: true, message: "Views count updated successfully" });
    }catch (error) {
        console.error("Error updating document", error);
        return res.status(500).json({ message: "Error updating document" });
    }
}

exports.setAFavouriteContent = async (req, res, next) => {
    const userId = req.body.userId;
    const contentId = req.params.id;
    // const favouriteList = req.body.favouriteList;
    
    if (!userId || !contentId) {
        return res.status(400).json({  
            status: "NOT_COMPLETED",
            message: "Request body is missing userId or contentId",
        });
    }
    try {
        const contentDocRef = db.collection('content').doc(contentId);
        const contentDoc = await contentDocRef.get();

        if (!contentDoc.exists) {
            return res.status(404).json({
                status: "NOT_COMPLETED",
                message: "Content not found",
            });
        }

        const favouriteList = contentDoc.data().favouriteList || [];

        if (favouriteList.includes(userId)) {
            await contentDocRef.update({
                favouriteList: FieldValue.arrayRemove(userId)
            });
            console.log('arrayRemove ================>>>');
        } else {
            await contentDocRef.update({
                favouriteList: FieldValue.arrayUnion(userId)
            });
            console.log('arrayUnion ================>>>');
        }

        const updatedDoc = await contentDocRef.get();
        const updatedFavouriteList = updatedDoc.data().favouriteList;

        res.status(200).json({
            status: "COMPLETED",
            favouriteList: updatedFavouriteList,
        });
    } catch (error) {
        res.status(500).json({
            status: "NOT_COMPLETED",
            message: error.message,
        });
    }
}

exports.getAFavouriteContent = async (req, res, next) => {
    const dataList = [];
    const contentId = req.body.contentId;
    const userId = req.body.userId;
    const favouriteList = req.body.favouriteList;

    try {
        const contentDocRef = db.collection('content')
        .doc(contentId);
        const contentDoc = await contentDocRef.get();
        
        const favouriteList = contentDoc.data().favouriteList || [];
        console.log(" Function execute start fav========>>>>", favouriteList);

        if(favouriteList.includes(userId)){
            return res.status(200).json({result: true});
        }else{
            return res.status(200).json({result: false});
        }

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Error getting document"});
    }
}

exports.sendContactUsMessage =async(req, res) => {
    const contactUsMessage = req.body;

    try {
        console.log('req.body===>',req.body);
        await db.collection('inquiry').add(contactUsMessage);
        res.status(200).send({ success: true });
    } catch (error) {
        console.error('Error adding document: ', error);
        res.status(500).send({ success: false, error: error.message });
    }

}

exports.getLatestContent = async (req, res) => {
    const dataList = [];

    try {
        const query = db.collection("content")
            .orderBy("createAt", "desc")
            .limit(10);  // Limit the results to the latest 10 documents

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({ message: "Error getting document" });
    }
}

exports.getLatestTVSeries = async (req, res) => {
    const dataList = [];

    try {
        const query = db.collection("series")
            .orderBy("createAt", "desc")
            .limit(10);  // Limit the results to the latest 10 documents

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({ message: "Error getting document" });
    }
}

exports.getRandomTVSeries = async (req, res) => {
    try {
        const snapshot = await db.collection("series").get();
        const allSeries = [];

        snapshot.forEach((doc) => {
            allSeries.push(doc.data());
        });

        // Shuffle the array to ensure randomness
        const shuffledSeries = allSeries.sort(() => 0.5 - Math.random());

        // Get the first 10 elements from the shuffled array
        const selectedSeries = shuffledSeries.slice(0, 10);

        return res.status(200).json({
            data: selectedSeries,
        });

    } catch (error) {
        console.error("Error getting documents", error);
        return res.status(500).json({ message: "Error getting documents" });
    }
}

exports.getRandomMovies = async (req, res) => {
    try {
        const snapshot = await db.collection("content")
            .where("category", "==", "Movies")
            .orderBy("createAt", "desc")
            // .limit(10)
            .get();

        const allMovies = [];

        snapshot.forEach((doc) => {
            allMovies.push(doc.data());
        });

        // Shuffle the array to ensure randomness
        const shuffledMovies = allMovies.sort(() => 0.5 - Math.random());

        // Get the first 10 elements from the shuffled array
        const selectedMovies = shuffledMovies.slice(0, 10);

        return res.status(200).json({
            data: selectedMovies,
        });

    } catch (error) {
        console.error("Error getting documents", error);
        return res.status(500).json({ message: "Error getting documents" });
    }
}

exports.getPopularContent = async (req, res) => {
    const dataList = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const lastMonth = currentMonth === 1
        ? `${currentYear - 1}-12`
        : `${currentYear}-${currentMonth - 1 < 10 ? '0' : ''}${currentMonth - 1}`;

    try {
        const contentViewsQuery = db.collection("contentViews");
        const contentViewsSnapshot = await contentViewsQuery.get();

        contentViewsSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data[lastMonth]) {
                dataList.push({
                    ...data,
                    id: doc.id,
                    lastMonthLength: data[lastMonth].length
                });
                console.log('lastMonthLength==>',data[lastMonth].length);
            }

        });

        // Sort the documents by the length of the lastMonth array in descending order
        dataList.sort((a, b) => b.lastMonthLength - a.lastMonthLength);

        // Limit the results to the top 10 documents
        const top10Data = dataList.slice(0, 10);
        const top10Ids = top10Data.map(item => item.id);

        // Step 2: Get the popular content based on top 10 IDs from most viewed content
        if (top10Ids.length === 0) {
            return res.status(200).json({
                data: [],
                message: 'No content found for the specified period.'
            });
        }

        const contentQuery = db.collection("content")
            .where('id', 'in', top10Ids); // Use the 'in' operator to filter by IDs

        const contentSnapshot = await contentQuery.get();
        const popularData = [];
        contentSnapshot.forEach((doc) => {
            popularData.push(doc.data());
        });
        console.log('pol==>',popularData.length)
        return res.status(200).json({
            data: popularData,
        });


    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({ message: "Error getting document" });
    }
}

exports.getContentByContentId = async (req, res)=> {
    const dataList=[];
    contentId= req.body.contentId;

    try {
        const query =  db.collection("content")
            .where("id", "==", contentId)
            .orderBy("createAt", "desc");

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            dataList.push(data);
        });

        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}





