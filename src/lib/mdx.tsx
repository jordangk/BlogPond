import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { blockComponents } from "@/blocks";

export function MDX({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={blockComponents}
      options={{
        // Allow JSX expression attributes like <Features items={[...]} />.
        // next-mdx-remote v6 blocks these by default for safety.
        blockJS: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
          ],
        },
      }}
    />
  );
}
