import express from "express"
import { test } from "../controller/test.js";
const router = express.Router();

router.get("/test" , test);

export default router;