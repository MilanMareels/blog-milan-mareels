import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import CommentSection from "@/app/_components/comment-section";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = post.title;
  const description = post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/posts/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author.name],
      images: [
        {
          url: post.ogImage.url,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.ogImage.url],
    },
  };
}

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  // 2. Structured Data (Schema.org) voor BlogPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.ogImage.url,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author.name,
      image: post.author.picture,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.milanmareels.be/posts/${params.slug}`,
    },
    publisher: {
      "@type": "Person",
      name: "Milan Mareels",
    },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader title={post.title} coverImage={post.coverImage} date={post.date} author={post.author} />
          <PostBody content={content} />
          <CommentSection slug={params.slug} />
        </article>
      </Container>
    </main>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
