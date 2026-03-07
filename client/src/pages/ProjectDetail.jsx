import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Github, Trash2, Send, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import api from "../utils/axios";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.project);
      if (user && data.project.owner._id === user.id) {
        const res = await api.get(`/joinrequests/${id}`);
        setRequests(res.data.requests);
      }
    } catch {
      toast.error("Project not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    setRequesting(true);
    try {
      await api.post(`/joinrequests/${id}`, { message });
      toast.success("Join request sent! 🚀");
      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setRequesting(false);
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await api.put(`/joinrequests/${requestId}/respond`, { status });
      toast.success(status === "accepted" ? "Member added! 🎉" : "Request rejected");
      fetchProject();
    } catch {
      toast.error("Failed to respond");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      navigate("/");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isOwner = user?.id === project?.owner?._id;
  const isMember = project?.members?.some((m) => m._id === user?.id);

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className={`text-xs px-2 py-1 rounded-full mb-3 inline-block ${project.status === "open" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                {project.status}
              </span>
              <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            </div>
            {isOwner && (
              <button onClick={handleDelete} className="text-red-400 hover:text-red-300 transition">
                <Trash2 size={20} />
              </button>
            )}
          </div>
          <p className="text-gray-400 mb-6 leading-relaxed">{project.description}</p>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Skills Required</p>
            <div className="flex flex-wrap gap-2">
              {project.skillsRequired?.map((s) => (
                <span key={s} className="text-xs bg-violet-600/20 text-violet-300 px-3 py-1 rounded-full border border-violet-500/30">{s}</span>
              ))}
            </div>
          </div>
          {project.techStack?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((t) => (
                  <span key={t} className="text-xs bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">{t}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
              {project.owner?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{project.owner?.name}</p>
              <p className="text-gray-400 text-sm">{project.owner?.email}</p>
            </div>
            {project.owner?.github && (
              <a href={project.owner.github} target="_blank" rel="noreferrer" className="ml-auto text-gray-400 hover:text-white transition">
                <Github size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-violet-400" />
            Team Members ({project.members?.length}/{project.teamSize})
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.members?.map((member) => (
              <div key={member._id} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold">
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-300">{member.name}</span>
                {member._id === project.owner._id && (
                  <span className="text-xs text-violet-400">Owner</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Team Chat Button - Members Only */}
        {isMember && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-violet-400" />
              Team Chat
            </h2>
            <p className="text-gray-400 text-sm mb-4">Chat with your team members in real-time!</p>
            <button
              onClick={() => navigate(`/chat/${project._id}`)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              <MessageSquare size={16} />
              Open Team Chat 💬
            </button>
          </div>
        )}

        {/* Join Request */}
        {user && !isOwner && !isMember && project.status === "open" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Request to Join</h2>
            <textarea
              placeholder="Tell the owner why you want to join this project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition resize-none mb-4"
            />
            <button
              onClick={handleJoinRequest}
              disabled={requesting}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              <Send size={16} />
              {requesting ? "Sending..." : "Send Request"}
            </button>
          </div>
        )}

        {/* Join Requests - Owner Only */}
        {isOwner && requests.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Join Requests ({requests.length})</h2>
            <div className="space-y-4">
              {requests.filter((r) => r.status === "pending").map((req) => (
                <div key={req._id} className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
                      {req.sender?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{req.sender?.name}</p>
                      <p className="text-gray-400 text-xs">{req.message || "No message"}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {req.sender?.skills?.map((s) => (
                          <span key={s} className="text-xs text-violet-300 bg-violet-600/20 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(req._id, "accepted")} className="text-green-400 hover:text-green-300 transition">
                      <CheckCircle size={22} />
                    </button>
                    <button onClick={() => handleRespond(req._id, "rejected")} className="text-red-400 hover:text-red-300 transition">
                      <XCircle size={22} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}