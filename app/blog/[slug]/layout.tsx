import { readdir } from "fs/promises";

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
  return (
    <div>
      <h2>{props.params.slug}</h2>
      {props.children}
    </div>
  );
}
