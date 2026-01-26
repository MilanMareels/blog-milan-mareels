"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Comment = {
  id: number;
  created_at: string;
  author: string;
  content: string;
  is_approved: boolean;
};

export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const fetchComments = async () => {
    const { data } = await supabase.from("comments").select("*").eq("slug", slug).eq("is_approved", true).order("created_at", { ascending: false });

    if (data) setComments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("comments").insert([{ slug, author, content }]);

    if (!error) {
      setAuthor("");
      setContent("");
      setMessage("Thanks! Your comment has been submitted and is awaiting approval.");
    } else {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section className="max-w-5xl mx-auto mt-16 pt-10 border-t border-neutral-200">
      <h3 className="text-2xl font-bold mb-8">Comments</h3>

      <div className="space-y-8 mb-16">
        {comments.map((comment) => (
          <div key={comment.id} className="pb-6 border-b border-gray-100">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-bold text-lg">{comment.author}</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-gray-500 italic">No comments yet.</p>}
      </div>

      <div className="bg-neutral-50 p-8 rounded-lg">
        <h4 className="text-xl font-bold mb-4">Leave a comment</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Name</label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Comment</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts?"
              required
            />
          </div>

          {message && <p className={`mb-4 text-sm font-bold ${message.includes("Thanks") ? "text-black" : "text-red-600"}`}>{message}</p>}

          <button type="submit" disabled={loading} className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-neutral-800 disabled:opacity-50 transition-colors">
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </div>
    </section>
  );
}
