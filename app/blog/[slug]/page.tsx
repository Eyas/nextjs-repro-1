import { compileMDX } from "next-mdx-remote/rsc";
import { readFile } from "fs/promises";

import { imageMetadata } from "@/lib/img";

export default async function Page(props: { params: { slug: string } }) {
  const { content, frontmatter } = await compileMDX({
    source: await readFile(`./blog/${props.params.slug}.mdx`),
    options: {
      mdxOptions: {
        rehypePlugins: [imageMetadata],
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
