import prisma from "../config/prismaClient.js";

interface postCreated {
    postId : string;
    authorId : string;
}

const handlePostcreated = async({postId , authorId} :postCreated): Promise<boolean> => {
    try {
        const recipientId = authorId;
        if(!recipientId){
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
        return true
    } catch (error) {
        return false
    }
}
export default handlePostcreated;