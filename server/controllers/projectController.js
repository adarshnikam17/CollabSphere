import Project from "../models/Project.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    const { title, description, skillsRequired, techStack, teamSize } = req.body;
    const project = await Project.create({
      title, description, skillsRequired, techStack, teamSize,
      owner: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Projects
export const getAllProjects = async (req, res) => {
  try {
    const { skill, tech } = req.query;
    let filter = { status: "open" };
    if (skill) filter.skillsRequired = { $in: [skill] };
    if (tech) filter.techStack = { $in: [tech] };

    const projects = await Project.find(filter)
      .populate("owner", "name email avatar skills")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Single Project
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatar skills github")
      .populate("members", "name email avatar skills");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });
    await project.deleteOne();
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};