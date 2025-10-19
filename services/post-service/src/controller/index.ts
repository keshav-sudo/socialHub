import  {createPost } from "./post/createPost.js";
import { getAllPosts } from "./post/getAllPost.js";
import { getUserPosts } from "./post/getUserPosts.js";
import { test } from "./post/test.js";
import {getPost} from "./post/getPost.js"
import { UpdatePost } from "./post/updatePost.js";
import { deletePost } from "./post/DeletePost.js";
import {createComment} from "./comment/createComment.js";
import {deleteComment} from "./comment/deleteComment.js";
import {updateComment} from "./comment/updateComment.js";
import { getComments } from "./comment/getComment.js";
import {createDisLike} from "./like/disLike.js"
import {createLike} from "./like/likeCreate.js"

export default {
    createPost,
    getAllPosts,
    getUserPosts,
    test,
    UpdatePost,
    deletePost,
    createComment,
    deleteComment,
    updateComment,
    getPost,
    createDisLike,
    createLike,
    getComments
}