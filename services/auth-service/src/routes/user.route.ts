import { Router } from "express";
const router = Router();

import { 
  
    signupController,
    requestPassReset,
    verifyPassResetOtp,
    resetPassword
} from "../controller/index.js"


router.post("/signup", signupController);

router.post("/request-password-reset", requestPassReset);
router.post("/verify-reset-otp/:email", verifyPassResetOtp);
router.post("/reset-password", resetPassword);

export default router;