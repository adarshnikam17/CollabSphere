import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Rocket, Users, Clock, CheckCircle, XCircle, PlusCircle } from "lucide-react";
import api from "../utils/axios";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [myProjects, setMyProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/projects");
      const owned = data.projects.filter((p) => p.owner._id === user.id || p.owner === user.id);
      const joined = data.projects.filter((p) => {
        const isMember = p.members?.some((m) => m._id === user.id || m === user.id);
        const isOwner = p.owner._id === user.id || p.owner === user.id;
        return isMember && !isOwner;
      });
      setMyProjects(owned);
      setJoinedProjects(joined);

      // Fetch requests for all owned projects
      const requestPromises = owned.map((p) =>
        api.get(`/joinrequests/${p._id}`).then((res) =>
          res.data.requests.map((r) => ({ ...r, projectTitle: p.title, projectId: p._id }))
        ).catch(() => [])
      );
      const allReqs = (await Promise.all(requestPromises)).flat();
      setAllRequests(allReqs.filter((r) => r.status === "pending"));
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await api.put(`/joinrequests/${requestId}/respond`, { status });
      toast.success(status === "accepted" ? "Member added! 🎉" : "Request rejected");
      fetchDashboard();
    } catch {
      toast.error("Failed to respond");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name}! 👋</p>
          </div>
          <Link to="/create-project" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            <PlusCircle size={16} /> New Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: "My Projects", value: myProjects.length, icon: Rocket, color: "violet" },
            { label: "Joined Projects", value: joinedProjects.length, icon: Users, color: "blue" },
            { label: "Pending Requests", value: allRequests.length, icon: Clock, color: "yellow" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-${color}-600/20 flex items-center justify-center`}>
                <Icon className={`text-${color}-400`} size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-gray-400 text-sm">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Projects */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Rocket size={18} className="text-violet-400" /> My Projects
            </h2>
            {myProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-3">No projects yet</p>
                <Link to="/create-project" className="text-violet-400 hover:text-violet-300 text-sm">
                  Post your first project →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myProjects.map((p) => (
                  <Link key={p._id} to={`/projects/${p._id}`} className="flex items-center justify-between bg-gray-800 hover:bg-gray-750 rounded-xl p-4 transition group">
                    <div>
                      <p className="text-white font-medium group-hover:text-violet-400 transition">{p.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{p.members?.length}/{p.teamSize} members</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.status === "open" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {p.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pending Join Requests */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-yellow-400" /> Pending Requests
            </h2>
            {allRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allRequests.map((req) => (
                  <div key={req._id} className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold">
                          {req.sender?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{req.sender?.name}</p>
                          <p className="text-gray-500 text-xs">{req.projectTitle}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleRespond(req._id, "accepted")} className="text-green-400 hover:text-green-300 transition">
                          <CheckCircle size={20} />
                        </button>
                        <button onClick={() => handleRespond(req._id, "rejected")} className="text-red-400 hover:text-red-300 transition">
                          <XCircle size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {req.sender?.skills?.slice(0, 3).map((s) => (
                        <span key={s} className="text-xs text-violet-300 bg-violet-600/20 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Joined Projects */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={18} className="text-blue-400" /> Joined Projects
            </h2>
            {joinedProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-3">Not part of any project yet</p>
                <Link to="/" className="text-violet-400 hover:text-violet-300 text-sm">
                  Explore projects →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {joinedProjects.map((p) => (
                  <Link key={p._id} to={`/projects/${p._id}`} className="flex items-center justify-between bg-gray-800 hover:bg-gray-750 rounded-xl p-4 transition group">
                    <div>
                      <p className="text-white font-medium group-hover:text-violet-400 transition">{p.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">by {p.owner?.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.status === "open" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {p.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}