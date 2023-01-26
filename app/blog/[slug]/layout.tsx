import { readdir, readFile } from "fs/promises";
import { compileMDX } from "next-mdx-remote/rsc";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const files = await readdir("./blog/");
  return files
    .filter((value) => value.endsWith(".mdx"))
    .map((filename) => ({
      slug: filename.replaceAll(/\.mdx$/g, ""),
    }));
}

export default async function Layout(props: {
  params: Params;
  children: React.ReactNode;
}) {
  const { content } = await compileMDX({
    source: await readFile(`./blog/${props.params.slug}.mdx`),
    options: {},
    components: {},
    compiledSource: undefined! /* unused by rsc */,
  });

  return (
    <div>
      <h2>{props.params.slug}</h2>
      {content}
    </div>
  );
}
