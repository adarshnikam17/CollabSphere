import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Users, Code2, Rocket, ArrowRight, Zap, Shield, Globe, Github, Twitter, Linkedin, Mail, Instagram } from "lucide-react";
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

  useEffect(() => { fetchProjects(); }, []);

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

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.skillsRequired?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-950">

      {/* ===== HERO SECTION ===== */}
      {!user && (
        <>
          <div className="relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-3xl" />
            <div className="relative max-w-7xl mx-auto px-4 py-28 text-center">
              <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm px-4 py-2 rounded-full mb-6">
                <Rocket size={14} /> Connect. Collaborate. Build.
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Find Your Perfect<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Dev Team</span>
              </h1>
              <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                CollabSphere connects developers with ideas to developers with skills. Post your project, find teammates, and build something amazing together.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/register" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-xl transition text-lg">
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 px-8 py-4 rounded-xl transition text-lg">
                  Login
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-16 mt-20">
                {[["Projects", projects.length + "+"], ["Developers", "100+"], ["Teams Formed", "50+"]].map(([label, val]) => (
                  <div key={label} className="text-center">
                    <div className="text-4xl font-bold text-white">{val}</div>
                    <div className="text-gray-400 text-sm mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== HOW IT WORKS ===== */}
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
              <p className="text-gray-400">3 simple steps to find your dream team</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
  { icon: Code2, title: "Post Your Project", desc: "Share your idea, required skills, and team size. Let developers know what you're building.", color: "violet" },
  { icon: Users, title: "Receive Requests", desc: "Developers interested in your project will send join requests with their skills and message.", color: "blue" },
  { icon: Rocket, title: "Build Together", desc: "Accept teammates, collaborate in real-time chat, and build your project as a team.", color: "green" },
].map(({ icon: Icon, title, desc, color }) => (
  <div key={title} className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
    <div className={`w-14 h-14 rounded-2xl bg-${color}-600/20 flex items-center justify-center mx-auto mb-4`}>
      <Icon className={`text-${color}-400`} size={26} />
    </div>
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
))}
            </div>
          </div>

          {/* ===== FEATURES ===== */}
          <div className="bg-gray-900/50 py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-14">
                <h2 className="text-3xl font-bold text-white mb-3">Why CollabSphere?</h2>
                <p className="text-gray-400">Everything you need to collaborate effectively</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Zap, title: "Real-time Chat", desc: "Chat with your team instantly using Socket.io powered messaging.", color: "yellow" },
                  { icon: Shield, title: "Secure Auth", desc: "JWT based authentication keeps your account and projects safe.", color: "green" },
                  { icon: Users, title: "Team Management", desc: "Manage join requests, accept or reject members with one click.", color: "blue" },
                  { icon: Globe, title: "Open Projects", desc: "Browse all open projects and find one that matches your skills.", color: "violet" },
                  { icon: Code2, title: "Tech Stack Tags", desc: "Filter projects by tech stack and find exactly what you want to work on.", color: "pink" },
                  { icon: Rocket, title: "Easy Deploy", desc: "Built with MERN stack - easy to deploy and scale for production.", color: "orange" },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition">
                    <div className={`w-10 h-10 rounded-xl bg-${color}-600/20 flex items-center justify-center mb-4`}>
                      <Icon className={`text-${color}-400`} size={20} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== CTA SECTION ===== */}
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="bg-gradient-to-r from-violet-900/40 to-blue-900/40 border border-violet-500/20 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Something Amazing?</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">Join hundreds of developers already collaborating on CollabSphere.</p>
              <Link to="/register" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-10 py-4 rounded-xl transition text-lg">
                Join CollabSphere <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ===== PROJECTS SECTION ===== */}
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

      {/* ===== FOOTER ===== */}
        {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-xl font-bold text-white mb-3">
                <Code2 className="text-violet-500" size={24} />
                <span>Collab<span className="text-violet-500">Sphere</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                A platform where developers connect, collaborate, and build amazing projects together.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="https://github.com/adarshnikam17" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition"><Github size={20} /></a>
                <a href="https://instagram.com/adarsh_nikam_" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-pink-400 transition"><Instagram size={20} /></a>
                <a href="https://linkedin.com/in/adarshnikam17" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400 transition"><Linkedin size={20} /></a>
                <a href="mailto:adarshnikam51@gmail.com" className="text-gray-500 hover:text-violet-400 transition"><Mail size={20} /></a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Get Started</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-sm">© 2026 CollabSphere. Built with ❤️ by Adarsh Nikam</p>
          </div>
        </div>
      </footer>

    </div>
  );
}