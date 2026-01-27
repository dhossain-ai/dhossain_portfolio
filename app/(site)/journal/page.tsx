import { SectionHeader } from "@/components/section-header";
import { PostCardListing } from "@/components/content/post-card-listing";
import { getPublishedPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
    title: "Journal",
    description: "Travel logs, life updates, and personal reflections.",
    path: "/journal",
});

export default async function JournalPage() {
    const posts = await getPublishedPosts("journal");

    return (
        <div className="space-y-12">
            <SectionHeader
                eyebrow="Life"
                title="Journal"
                description="Notes from the road and life beyond code."
            />

            {posts.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {posts.map((post) => (
                        <PostCardListing
                            key={post.slug}
                            href={`/journal/${post.slug}`}
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
            <p className="text-lg font-semibold text-foreground">Quiet for now.</p>
            <p className="mt-2 text-sm text-muted-foreground">
                I haven&apos;t posted any journal entries yet. Check back later!
            </p>
        </div>
    );
}
