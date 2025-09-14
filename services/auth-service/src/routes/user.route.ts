import { Router } from "express";
const router = Router();

import { 
    loginController,
    signupController,
    requestPassReset,
    verifyPassResetOtp,
    resetPassword
} from "../controller/index.js"


router.post("/login", loginController);
router.post("/signup", signupController);

router.post("/request-password-reset", requestPassReset);
router.post("/verify-reset-otp/:email", verifyPassResetOtp);
router.post("/reset-password", resetPassword);

export default router;