import express from "express"
import controller from "../controller/index.js";

const router = express.Router();

router.post("/like/:id" , controller.createLike);
router.patch("/like/:id" , controller.createDisLike)

export default router;