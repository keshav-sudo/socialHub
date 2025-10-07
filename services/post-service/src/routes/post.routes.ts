import express from "express"
import upload from "../config/multer.js";
import controller from "../controller/index.js";

const router = express.Router();

router.get("/test" , controller.test);
router.post("/" , upload.array('file', 10) , controller.createPost);
router.get ("/getall" ,  controller.getAllPosts);
router.get ("/:id" ,  controller.getPost);
router.patch("/:id" , controller.UpdatePost);
router.delete("/:id" , controller.deletePost);
export default router;