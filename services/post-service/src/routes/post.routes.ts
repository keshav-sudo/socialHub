import express from "express"
import upload from "../config/multer.js";
import controller from "../controller/index.js";
import { createPost } from "../controller/createPost.js";
import { deletePost } from "../controller/DeletePost.js";
const router = express.Router();

router.get("/test" , controller.test);
router.post("/" , upload.array('file', 10) , controller.createPost);
router.get ("/" ,  controller.getAllPosts);
router.patch("/:id" , controller.UpdatePost);
router.delete("/:id" , deletePost);
export default router;