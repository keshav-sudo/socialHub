import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    
    params: {
        folder: 'socialHub',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'mov', 'avi' ,'webm'],
    } as any,
});

const upload = multer({ storage: storage ,
     limits: {
    fileSize: 100 * 1024 * 1024 
  }
});

export default upload;
