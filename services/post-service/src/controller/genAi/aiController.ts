import { Request, Response } from 'express';
import { contentChain, captionChain } from '../../config/generate.js';

interface ContentRequestBody {
  topic: string;
  tone: string;
}

interface CaptionRequestBody {
  topic: string;
}

export const generateContentController = async (req: Request<{}, {}, ContentRequestBody>, res: Response) => {
  const { topic, tone } = req.body;

  if (!topic || !tone) {
    return res.status(400).json({ message: 'Error: Topic, platform, and tone are required.' });
  }

  try {
    // Invoke the LangChain content generation logic
    const generatedContent = await contentChain.invoke({
      topic,
      tone,
    });
    
    // Send the structured success response
    res.status(200).json({
      topic,
      tone,
      content: generatedContent,
    });
  } catch (error) {
    console.error("Content generation failed:", error);
    res.status(500).json({ message: 'Server error: Failed to generate content.' });
  }
};



export const generateCaptionController = async (req: Request<{}, {}, CaptionRequestBody>, res: Response) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Error: Topic and platform are required.' });
  }

  try {
    const generatedCaption = await captionChain.invoke({
      topic,
    });
    
    res.status(200).json({
      topic,
      caption: generatedCaption,
    });
  } catch (error) {
    console.error("Caption generation failed:", error);
    res.status(500).json({ message: 'Server error: Failed to generate caption.' });
  }
};