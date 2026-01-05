"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Comment = {
  id: number;
  created_at: string;
  slug: string;
  author: string;
  content: string;
  is_approved: boolean;
};

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [approvedComments, setApprovedComments] = useState<Comment[]>([]);

  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchPendingComments();
        fetchApprovedComments();
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoginError("Login failed: " + error.message);
    } else {
      setSession(data.session);
      fetchPendingComments();
      fetchApprovedComments();
    }
    setLoading(false);
  };

  const fetchPendingComments = async () => {
    const { data } = await supabase.from("comments").select("*").eq("is_approved", false).order("created_at", { ascending: false });
    if (data) setPendingComments(data);
  };

  const fetchApprovedComments = async () => {
    const { data } = await supabase.from("comments").select("*").eq("is_approved", true).order("created_at", { ascending: false }); // Nieuwste eerst
    if (data) setApprovedComments(data);
  };

  const approveComment = async (id: number) => {
    if (!window.confirm("Are you sure you want to APPROVE this comment?")) return;

    const { error } = await supabase.from("comments").update({ is_approved: true }).eq("id", id);

    if (!error) {
      fetchPendingComments();
      fetchApprovedComments();
    }
  };

  const deleteComment = async (id: number) => {
    if (!window.confirm("Are you sure you want to DELETE this comment permanently?")) return;

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (!error) {
      fetchPendingComments();
      fetchApprovedComments();
    }
  };

  const groupedComments = approvedComments.reduce((acc, comment) => {
    if (!acc[comment.slug]) {
      acc[comment.slug] = [];
    }
    acc[comment.slug].push(comment);
    return acc;
  }, {} as Record<string, Comment[]>);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {loginError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{loginError}</div>}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Comment Dashboard</h1>
        <button onClick={() => supabase.auth.signOut().then(() => setSession(null))} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 text-sm font-semibold">
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
            // Loop door de slugs (Post titels)
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
