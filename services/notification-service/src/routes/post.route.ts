import { Router } from "express";
import { getUserNotifications } from "../controller/postNotification.js";

const router = Router();

router.get("/notifications" ,getUserNotifications );

export default router;