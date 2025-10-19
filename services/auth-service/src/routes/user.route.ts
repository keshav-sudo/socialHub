import { Router } from "express";
const router = Router();

import { 
    loginController,
    signupController,
    requestPassReset,
    verifyPassResetOtp,
    resetPassword,
    verifyUser,
    checkUsernameAvailability,
    searchUsers,
    getUserProfile,
    updateUserProfile
} from "../controller/index.js"


router.post("/login", loginController);
router.post("/signup", signupController);

router.post("/request-password-reset", requestPassReset);
router.post("/verify-reset-otp/:email", verifyPassResetOtp);
router.post("/reset-password", resetPassword);

router.get("/verify-user" ,verifyUser )
router.post("/check/:username" , checkUsernameAvailability)

// User profile and search routes
router.get("/search", searchUsers);
router.get("/profile/:userId", getUserProfile);
router.patch("/profile", updateUserProfile);

export default router;