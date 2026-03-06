import JoinRequest from "../models/JoinRequest.js";
import Project from "../models/Project.js";

// Send Join Request
export const sendJoinRequest = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() === req.user.id)
      return res.status(400).json({ message: "You own this project" });

    if (project.members.includes(req.user.id))
      return res.status(400).json({ message: "Already a member" });

    const existing = await JoinRequest.findOne({
      project: req.params.projectId,
      sender: req.user.id,
    });
    if (existing) return res.status(400).json({ message: "Request already sent" });

    const joinRequest = await JoinRequest.create({
      project: req.params.projectId,
      sender: req.user.id,
      message: req.body.message || "",
    });

    res.status(201).json({ success: true, joinRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Join Requests for a Project (owner only)
export const getJoinRequests = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    const requests = await JoinRequest.find({ project: req.params.projectId })
      .populate("sender", "name email avatar skills github");

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Accept or Reject Join Request
export const respondToRequest = async (req, res) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.requestId);
    if (!joinRequest) return res.status(404).json({ message: "Request not found" });

    const project = await Project.findById(joinRequest.project);
    if (project.owner.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    const { status } = req.body; // "accepted" or "rejected"
    joinRequest.status = status;
    await joinRequest.save();

    if (status === "accepted") {
      project.members.push(joinRequest.sender);
      await project.save();
    }

    res.status(200).json({ success: true, joinRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};