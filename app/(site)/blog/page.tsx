import { SectionHeader } from "@/components/section-header";
import { PostCardListing } from "@/components/content/post-card-listing";
import { getPublishedPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Writing on applied AI, data science workflows, and building thoughtful developer experiences.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPublishedPosts("blog");

  return (
    <div className="space-y-12">
      <SectionHeader
        eyebrow="Thinking"
        title="Notes from the lab"
        description="Ideas I am exploring around applied AI, product strategy, and developer tooling."
      />

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCardListing
              key={post.slug}
              href={`/blog/${post.slug}`}
              title={post.title}
              excerpt={post.excerpt}
              coverImage={post.cover_image}
              date={post.published_at || post.created_at}
              readingTime={post.readingTime}
              tags={post.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border/70 bg-card/80 p-10 text-center shadow-sm">
      <p className="text-lg font-semibold text-foreground">Stay tuned.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        I am drafting essays on applied AI experiments, product insights, and the craft of
        data-informed storytelling. Subscribe soon for updates.
      </p>
    </div>
  );
}
