import prisma from "../config/prismaClient.js";

interface postCreated {
    postId : string;
    authorId : string;
}
interface commentCreated {
    postId : string;
    authorId : string;
}

const handlePostcreated = async({postId , authorId} :postCreated): Promise<boolean> => {
    try {
        const recipientId = authorId;
        if(!recipientId){
         console.error("Handler Error: Received post.created event with missing authorId.");
         return false;
        }
        if (!postId) {
             console.error("Handler Error: Received post.created event with missing postId.");
             return false;
        }

        const notificationinsert = await prisma.notifications.create({
            data: {
                userId: authorId,
                triggeredById: authorId, 
                type: "POST",
                message: "You Created a new Post!",
                link: `/posts/${postId}`,
                is_read: false,
            }
        })
        if(!notificationinsert){
            return false;
        }
        return true
    } catch (error) {
        // FIX: Log the specific database error here!
        console.error("❌ Prisma DB Error during notification creation:", error);
        return false
    }
}

const handleCommentcreated = async() => {

}

export default handlePostcreated;
