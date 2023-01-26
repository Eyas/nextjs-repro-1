import { compileMDX } from "next-mdx-remote/rsc";
import { readFile } from "fs/promises";

import { remarkHeadingId } from "remark-custom-heading-id";
import remarkUnwrapImages from "remark-unwrap-images";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypePrism from "@mapbox/rehype-prism";
import { imageMetadata } from "@/lib/img";

export default async function Page(props: { params: { slug: string } }) {
  const { content, frontmatter } = await compileMDX({
    source: await readFile(`./blog/${props.params.slug}.mdx`),
    options: {
      mdxOptions: {
        rehypePlugins: [
          imageMetadata,
          rehypeSlug as any,
          rehypePrism,
          // codeMeta,
          // spanCombiner,
        ],
        remarkPlugins: [
          // smartypants,
          remarkHeadingId,
          remarkUnwrapImages as any,
          remarkGfm,
        ],
      },
    },
    components: {},
    compiledSource: undefined! /* unused by rsc */,
  });
  return (
    <>
      <p>Frontmatter: {JSON.stringify(frontmatter)}</p>
      {/* <article>{content}</article> */}
    </>
  );
}
