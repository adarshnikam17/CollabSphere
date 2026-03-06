import express from "express";
import { sendJoinRequest, getJoinRequests, respondToRequest } from "../controllers/joinRequestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:projectId", protect, sendJoinRequest);
router.get("/:projectId", protect, getJoinRequests);
router.put("/:requestId/respond", protect, respondToRequest);

export default router;