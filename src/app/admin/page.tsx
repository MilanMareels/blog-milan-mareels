"use client";

import { useState, useEffect } from "react";

type Comment = {
  id: string;
  created_at: string;
  slug: string;
  author: string;
  content: string;
  is_approved: boolean;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [approvedComments, setApprovedComments] = useState<Comment[]>([]);

  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  useEffect(() => {
    if (localStorage.getItem("adminAuth") === "true") {
      setIsAuthenticated(true);
      fetchPendingComments();
      fetchApprovedComments();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("adminAuth", "true");
        fetchPendingComments();
        fetchApprovedComments();
      } else {
        setLoginError("Incorrect password");
      }
    } catch (error) {
      setLoginError("Login failed");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  const fetchPendingComments = async () => {
    const res = await fetch("/api/comments?is_approved=false");
    const data = await res.json();
    setPendingComments(data);
  };

  const fetchApprovedComments = async () => {
    const res = await fetch("/api/comments?is_approved=true");
    const data = await res.json();
    setApprovedComments(data);
  };

  const approveComment = async (id: string) => {
    if (!window.confirm("Are you sure you want to APPROVE this comment?")) return;

    await fetch("/api/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_approved: true }),
    });

    fetchPendingComments();
    fetchApprovedComments();
  };

  const deleteComment = async (id: string) => {
    if (!window.confirm("Are you sure you want to DELETE this comment permanently?")) return;

    await fetch(`/api/comments?id=${id}`, { method: "DELETE" });

    fetchPendingComments();
    fetchApprovedComments();
  };

  const groupedComments = approvedComments.reduce(
    (acc, comment) => {
      if (!acc[comment.slug]) {
        acc[comment.slug] = [];
      }
      acc[comment.slug].push(comment);
      return acc;
    },
    {} as Record<string, Comment[]>,
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {loginError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{loginError}</div>}
          <div className="mb-6">
            <input
              type="password"
              placeholder="Admin Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button disabled={loading} className="w-full bg-black text-white p-3 rounded font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Comment Dashboard</h1>
        <button onClick={handleLogout} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 text-sm font-semibold">
          Log out
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 px-2 font-bold text-lg ${activeTab === "pending" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-gray-600"}`}
        >
          Pending Reviews ({pendingComments.length})
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`pb-3 px-2 font-bold text-lg ${activeTab === "approved" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-gray-600"}`}
        >
          Approved Archive
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="space-y-4">
          {pendingComments.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-lg">No pending comments. Good job!</p>
            </div>
          ) : (
            pendingComments.map((comment) => (
              <div key={comment.id} className="border border-yellow-200 bg-yellow-50 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between text-sm text-gray-500 mb-3 border-b border-yellow-100 pb-2">
                  <span className="font-bold text-black text-base">{comment.author}</span>
                  <span className="italic">Post: {comment.slug}</span>
                </div>
                <p className="mb-6 text-gray-800 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => deleteComment(comment.id)} className="bg-white border border-red-600 text-red-600 px-5 py-2 rounded font-medium text-sm hover:bg-red-50">
                    Delete
                  </button>
                  <button onClick={() => approveComment(comment.id)} className="bg-black text-white px-6 py-2 rounded font-medium text-sm hover:bg-neutral-800">
                    Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "approved" && (
        <div>
          {Object.keys(groupedComments).length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-lg">No approved comments found yet.</p>
            </div>
          ) : (
            Object.keys(groupedComments).map((slug) => (
              <div key={slug} className="mb-10">
                <h2 className="text-xl font-bold bg-gray-100 p-3 rounded mb-4 border border-gray-200">
                  Blog Post: <span className="text-blue-600">{slug}</span>
                </h2>

                <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                  {groupedComments[slug].map((comment) => (
                    <div key={comment.id} className="bg-white border border-gray-200 p-4 rounded shadow-sm flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold">{comment.author}</span>
                          <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                      </div>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-red-500 text-xs font-bold border border-red-200 px-3 py-1 rounded hover:bg-red-50 hover:border-red-500 whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
