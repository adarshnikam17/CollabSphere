import express from "express";
import { createProject, getAllProjects, getProject, deleteProject } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProject);
router.post("/", protect, createProject);
router.delete("/:id", protect, deleteProject);

export default router;