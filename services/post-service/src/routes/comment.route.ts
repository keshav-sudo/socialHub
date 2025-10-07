import express from "express"
import controller from "../controller/index.js";

const router = express.Router();

router.post("/comment/:id", controller.createComment);
router.get ("/comment/:id" , controller.getComments);
router.patch("/comment/:id", controller.updateComment);
router.delete("/comment/:id", controller.deleteComment)

export default router;