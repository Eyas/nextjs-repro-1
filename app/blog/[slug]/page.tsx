import { compileMDX } from "next-mdx-remote/rsc";
import { readFile } from "fs/promises";

export default async function Page(props: { params: { slug: string } }) {
  const { content, frontmatter } = await compileMDX({
    source: await readFile(`./blog/${props.params.slug}.mdx`),
    options: {},
    components: {},
    compiledSource: undefined! /* unused by rsc */,
  });
  return (
    <>
      <p>Frontmatter: {JSON.stringify(frontmatter)}</p>
      <article>{content}</article>
    </>
  );
}
