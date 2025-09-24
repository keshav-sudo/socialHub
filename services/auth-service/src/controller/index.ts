import { loginController } from "./login.js";
import { signupController } from "./signup.js";
import {verifyUser} from "./verifyUser.js"
import { resetPassword , requestPassReset, verifyPassResetOtp} from "./resetPassWord.js";

export {
    loginController,
    signupController,
    resetPassword,
    requestPassReset,
    verifyPassResetOtp,
    verifyUser
};