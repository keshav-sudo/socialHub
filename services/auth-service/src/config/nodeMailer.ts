import * as  nodemailer from "nodemailer";
import { Dotenvs } from "../types/dotenv.js";

const FROM = Dotenvs.EMAIL_FROM;
const PASS = Dotenvs.EMAIL_PASS;


const transporter =  nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : FROM,
        pass : PASS
    },
})


transporter.verify((error) => {
    if(error){
        console.error("Error connecting to SMTP:", error);
    } else {
         console.log("Nodemailer connected properly ✅");
    }
});


export default transporter;