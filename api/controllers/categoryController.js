const {
    executeGetContent,
    executeGetSubCategory,
} = require("../services/categoryServices");


exports.getContent = async(req, res, next) => {
    try {
        const data = await executeGetContent();
        return res.status(200).json(data);
    } catch (error) {
        return  res.status(401).json(error);
    }
}

exports.getSubCategory = async( req, res, next) => {
    try {
        const data = await executeGetSubCategory();
        return res.status(200).json(data);
    }catch (error) {
        return res.status(401).json(error);
    }
}
