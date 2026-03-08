import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Rocket } from "lucide-react";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function CreateProject() {
  const [form, setForm] = useState({ title: "", description: "", teamSize: 2 });
  const [skillInput, setSkillInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [tech, setTech] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addTag = (e, list, setList, input, setInput) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!list.includes(input.trim())) setList([...list, input.trim()]);
      setInput("");
    }
  };

  const addTagBtn = (list, setList, input, setInput) => {
    if (input.trim() && !list.includes(input.trim())) {
      setList([...list, input.trim()]);
      setInput("");
    }
  };

  const removeTag = (item, list, setList) => setList(list.filter((i) => i !== item));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skills.length === 0) return toast.error("Add at least one required skill");
    setLoading(true);
    try {
      const { data } = await api.post("/projects", { ...form, skillsRequired: skills, techStack: tech });
      toast.success("Project posted! 🚀");
      navigate(`/projects/${data.project._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Rocket className="mx-auto text-violet-500 mb-3" size={40} />
          <h1 className="text-3xl font-bold text-white">Post a Project</h1>
          <p className="text-gray-400 mt-2">Find the perfect team for your idea</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Project Title</label>
              <input type="text" placeholder="e.g. AI Chatbot Web App" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Description</label>
              <textarea placeholder="Describe your project idea, goals, and what you're building..." value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition resize-none" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Team Size</label>
              <input type="number" min={2} max={10} value={form.teamSize}
                onChange={(e) => setForm({ ...form, teamSize: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Skills Required</label>
              <div className="flex gap-2">
                <input type="text" placeholder="React, Node.js, Python..." value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => addTag(e, skills, setSkills, skillInput, setSkillInput)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition" />
                <button type="button" onClick={() => addTagBtn(skills, setSkills, skillInput, setSkillInput)}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-lg transition font-semibold">
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s) => (
                  <span key={s} className="flex items-center gap-1 bg-violet-600/20 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-500/30">
                    {s} <X size={12} className="cursor-pointer" onClick={() => removeTag(s, skills, setSkills)} />
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Tech Stack</label>
              <div className="flex gap-2">
                <input type="text" placeholder="MERN, Docker, AWS..." value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => addTag(e, tech, setTech, techInput, setTechInput)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition" />
                <button type="button" onClick={() => addTagBtn(tech, setTech, techInput, setTechInput)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition font-semibold">
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tech.map((t) => (
                  <span key={t} className="flex items-center gap-1 bg-blue-600/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                    {t} <X size={12} className="cursor-pointer" onClick={() => removeTag(t, tech, setTech)} />
                  </span>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
              {loading ? "Posting..." : "Post Project 🚀"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}