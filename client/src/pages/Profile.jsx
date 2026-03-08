import { useState, useEffect } from "react";
import { Github, Save, X, User } from "lucide-react";
import api from "../utils/axios";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: "", bio: "", github: "" });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", bio: user.bio || "", github: user.github || "" });
      setSkills(user.skills || []);
    }
  }, [user]);

  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addSkillBtn = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", { ...form, skills });
      setAuth(data.user, localStorage.getItem("token"));
      toast.success("Profile updated! ✅");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
          <p className="text-gray-400 mt-1">{user?.email}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User size={18} className="text-violet-400" /> Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
              <input type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Bio</label>
              <textarea placeholder="Tell developers about yourself..." value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition resize-none" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block flex items-center gap-2">
                <Github size={14} /> GitHub URL
              </label>
              <input type="text" placeholder="https://github.com/username" value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Skills</label>
              <div className="flex gap-2">
                <input type="text" placeholder="React, Node.js, Python..." value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition" />
                <button type="button" onClick={addSkillBtn}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-lg transition font-semibold">
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <span key={skill} className="flex items-center gap-1 bg-violet-600/20 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-500/30">
                    {skill}
                    <X size={12} className="cursor-pointer" onClick={() => removeSkill(skill)} />
                  </span>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
              <Save size={16} />
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}