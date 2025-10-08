import express from "express";
import { followUser } from "../controller/followUser.js";
import { unFollow } from "../controller/unFollow.js";
import { getFollowCounts , getFollowersList, getFollowingList } from "../controller/getFollowing.js";

const router = express.Router();

router.post("/follow/:id", followUser);
router.post("/unfollow/:id", unFollow);
router.get("/following/list", getFollowingList);
router.get("/followers/list", getFollowersList);
router.get("/counts", getFollowCounts);

export default router;