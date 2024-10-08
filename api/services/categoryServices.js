const {
    susilaLifeDB,
    susilaLifeFirebaseApp,
} = require("../common/firebaseInit");
const categoryCollection = susilaLifeDB.collection("category");
const subsCategoryCollection = susilaLifeDB.collection("subcategory");

const executeGetContent = async() => {
    const data = [];
    let status = false;
    try {
        const query = categoryCollection;

        const snapshot = await query.get();
        snapshot.forEach((doc) =>{
            data.push(doc.data());
        });
        if(data.length > 0) status = true;
        // console.log("executeGetContent================>>>", dataList);
        return {data , status};
    }catch (e) { 
        console.error("Error executing getAllInquiries:", e)
        return{e}
    }
}

const executeGetSubCategory = async () => {
    const data = [];
    let status = false;
    try {
        const query = subsCategoryCollection;

        const snapshot = await query.get();
        snapshot.forEach((doc) =>{
            data.push(doc.data());
        })

        if(data.length > 0) status = true;
        // console.log("executeGetSubCategory================>>>", dataList);
        return {data , status};
    }catch (error) {
        console.error("Error executing getAllInquiries:", error)
    }
}


module.exports = {executeGetContent, executeGetSubCategory }
