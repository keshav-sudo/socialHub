import dotenvVar from "../types/Dotenv.js";
import { v2 as cloudinary } from "cloudinary";


const cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: dotenvVar.CLOUDINARY_CLOUD_NAME,
            api_key: dotenvVar.CLOUDINARY_API_KEY,
            api_secret: dotenvVar.CLOUDINARY_API_SECRET,
        });

        console.log("Cloudinary connected");
    } catch (error) {
        console.log("Cloudinary connection failed");
        console.log(error);
    }
}

cloudinaryConnect();


export default cloudinary;