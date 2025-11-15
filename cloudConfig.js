const cloudinary=require("cloudinary").v2;
const { CloudinaryStorage }=require("multer-storage-cloudinary");
//const { param } = require("./routes/listing");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,

});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: "WANDERLUST_DEV",
        allowedFormats: ["png","jpg","jpeg"],
        resource_type:"auto",
    },
});

module.exports={
    cloudinary,
    storage,
};