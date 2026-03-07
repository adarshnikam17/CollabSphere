import Message from "../models/Message.js";
import Project from "../models/Project.js";

export const getMessages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some(
      (m) => m.toString() === req.user.id
    );
    if (!isMember) return res.status(401).json({ message: "Not a member" });

    const messages = await Message.find({ project: req.params.projectId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};