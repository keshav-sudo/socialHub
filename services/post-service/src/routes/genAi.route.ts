import { Router } from "express";
import { generateContentController, generateCaptionController } from "../controller/genAi/aiController.js";

const router = Router();

router.post("/generate-content", generateContentController);
router.post("/generate-caption", generateCaptionController);

export default router;
