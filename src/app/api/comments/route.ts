import { connectMongoDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { Comment } from "@/app/models/Comment";

export async function GET(request: Request) {
  await connectMongoDB();
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const is_approved = searchParams.get("is_approved");

  let query: any = {};
  if (slug) query.slug = slug;
  if (is_approved !== null) query.is_approved = is_approved === "true";

  const comments = await Comment.find(query).sort({ createdAt: -1 });

  const formattedComments = comments.map((c) => ({
    id: c._id.toString(),
    created_at: c.createdAt,
    slug: c.slug,
    author: c.author,
    content: c.content,
    is_approved: c.is_approved,
  }));

  return NextResponse.json(formattedComments);
}

export async function POST(request: Request) {
  await connectMongoDB();
  const { slug, author, content } = await request.json();
  await Comment.create({ slug, author, content });
  return NextResponse.json({ message: "Comment succesvol aangemaakt" }, { status: 201 });
}

export async function PUT(request: Request) {
  await connectMongoDB();
  const { id, is_approved } = await request.json();
  await Comment.findByIdAndUpdate(id, { is_approved });
  return NextResponse.json({ message: "Geüpdatet" }, { status: 200 });
}

export async function DELETE(request: Request) {
  await connectMongoDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await Comment.findByIdAndDelete(id);
  return NextResponse.json({ message: "Verwijderd" }, { status: 200 });
}
