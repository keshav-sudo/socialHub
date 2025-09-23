// In a declaration file or at the top of your file
declare global {
    namespace Express {
        interface Request {
            file?: any; // You can define a more specific type if needed
        }
    }
}