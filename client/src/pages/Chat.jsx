import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { io } from "socket.io-client";
import api from "../utils/axios";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

let socket;

export default function Chat() {
  const { projectId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchData();
    setupSocket();
    return () => socket?.disconnect();
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchData = async () => {
    try {
      const [msgRes, projRes] = await Promise.all([
        api.get(`/messages/${projectId}`),
        api.get(`/projects/${projectId}`),
      ]);
      setMessages(msgRes.data.messages);
      setProject(projRes.data.project);
    } catch {
      toast.error("Access denied or project not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
  socket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000");
  socket.emit("joinRoom", projectId);
  socket.on("receiveMessage", (message) => {
    setMessages((prev) => [...prev, message]);
  });
};

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("sendMessage", {
      projectId,
      senderId: user.id,
      text: text.trim(),
    });
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-3 sticky top-16 z-40">
        <button onClick={() => navigate(`/projects/${projectId}`)} className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </button>
        <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
          {project?.title?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold">{project?.title}</p>
          <p className="text-gray-400 text-xs">{project?.members?.length} members</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = msg.sender?._id === user.id || msg.sender === user.id;
              return (
                <div key={msg._id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                      {msg.sender?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                    {!isMe && (
                      <span className="text-xs text-gray-500 mb-1 ml-1">{msg.sender?.name}</span>
                    )}
                    <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-violet-600 text-white rounded-br-sm" : "bg-gray-800 text-gray-100 rounded-bl-sm"}`}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-600 mt-1 mx-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}