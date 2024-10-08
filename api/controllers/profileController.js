const {susilaLifeDB: db} = require("../common/firebaseInit");


exports.getContentProviderProfilesForId = async(req, res, next) => {
    const dataList=[];
    let id = req.body.id;
    console.log("getContentProviderProfilesForId id ======>>>>", req.body.id);
    try {
        const query =  db.collection('contentProvider')
            .where("id", "==", id)
        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            dataList.push(doc.data());
            console.log("getContentProviderProfilesForId  List======>>>>", dataList);
        });
        return res.status(200).json({
            data: dataList,
        });

    } catch (error) {
        console.error("Error getting Document", error);
        return res.status(500).json({message: "Erroe getting document"});
    }
}