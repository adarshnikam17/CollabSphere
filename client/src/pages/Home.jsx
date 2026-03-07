import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Users, Code2, Rocket, ArrowRight } from "lucide-react";
import api from "../utils/axios";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project._id}`} className="block bg-gray-900 border border-gray-800 hover:border-violet-500/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-violet-500/10 group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition">{project.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${project.status === "open" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
          {project.status}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.skillsRequired?.slice(0, 4).map((skill) => (
          <span key={skill} className="text-xs bg-violet-600/20 text-violet-300 px-2 py-1 rounded-full border border-violet-500/30">{skill}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold">
            {project.owner?.name?.charAt(0).toUpperCase()}
          </div>
          <span>{project.owner?.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{project.members?.length}/{project.teamSize}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.skillsRequired?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      {!user && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-950 to-gray-950" />
          <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm px-4 py-2 rounded-full mb-6">
              <Rocket size={14} /> Connect. Collaborate. Build.
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect<br />
              <span className="text-violet-400">Dev Team</span>
            </h1>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              CollabSphere connects developers with ideas to developers with skills. Build something amazing together.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-xl transition">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 px-8 py-4 rounded-xl transition">
                Login
              </Link>
            </div>
            {/* Stats */}
            <div className="flex items-center justify-center gap-12 mt-16">
              {[["Projects", projects.length + "+"], ["Developers", "100+"], ["Teams Formed", "50+"]].map(([label, val]) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-bold text-white">{val}</div>
                  <div className="text-gray-400 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            {user ? "Explore Projects" : "Open Projects"}
          </h2>
          {user && (
            <Link to="/create-project" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              <Code2 size={16} /> Post Project
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by project name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-gray-800 rounded mb-3 w-3/4" />
                <div className="h-4 bg-gray-800 rounded mb-2 w-full" />
                <div className="h-4 bg-gray-800 rounded mb-4 w-2/3" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-800 rounded-full" />
                  <div className="h-6 w-16 bg-gray-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Code2 className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No projects found</p>
            {user && (
              <Link to="/create-project" className="mt-4 inline-block text-violet-400 hover:text-violet-300">
                Be the first to post one!
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}