// Similiar structure to:
// https://github.com/JS-DevTools/rehype-inline-svg/blob/master/src/inline-svg.ts
import { Processor } from "unified";
import { Node } from "unist";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import { computeMetadata } from "./metadata";

/**
 * An `<img>` HAST node
 */
interface ImageNode extends Node {
  type: "element";
  tagName: "img";
  properties: {
    src: string;
    height?: number;
    width?: number;
    blurDataURL?: string;
  };
}

/**
 * Determines whether the given HAST node is an `<img>` element.
 */
function isImageNode(node: Node): node is ImageNode {
  const img = node as ImageNode;
  return (
    img.type === "element" &&
    img.tagName === "img" &&
    img.properties &&
    typeof img.properties.src === "string"
  );
}

/**
 * Filters out non absolute paths from the public folder.
 */
function filterImageNode(node: ImageNode): boolean {
  return node.properties.src.startsWith("/");
}

/**
 * Adds the image's `height` and `width` to it's properties.
 */
async function addMetadata(node: ImageNode): Promise<void> {
  const metadata = await computeMetadata(node.properties.src);

  node.properties.width = metadata.width;
  node.properties.height = metadata.height;

  if ("blurDataURL" in metadata) {
    node.properties.blurDataURL = metadata.blurDataURL;
  }
}

/**
 * This is a Rehype plugin that finds image `<img>` elements and adds the height and width to the properties.
 * Read more about Next.js image: https://nextjs.org/docs/api-reference/next/image#layout
 */
export function imageMetadata(this: Processor) {
  return async function transformer(tree: Node, file: VFile): Promise<Node> {
    if (true as any) {
      return tree;
    }

    const imgNodes: ImageNode[] = [];

    visit(tree, "element", (node) => {
      if (isImageNode(node) && filterImageNode(node)) {
        imgNodes.push(node);
      }
    });

    for (const node of imgNodes) {
      await addMetadata(node);
    }

    return tree;
  };
}
