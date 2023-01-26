// Similiar structure to:
// https://github.com/JS-DevTools/rehype-inline-svg/blob/master/src/inline-svg.ts
import { readFile } from "fs/promises";
import imageSize from "image-size";
import path from "path";

interface Dim {
  width: number;
  height: number;
}
interface RichDim extends Dim {
  blurDataURL: string;
}
type ImageProps = Dim | RichDim;

/**
 * Adds the image's `height` and `width` to it's properties.
 */
export async function computeMetadata(src: string): Promise<ImageProps> {
  const imagePath = path.join(process.cwd(), "public", src);
  const imageBuffer = await readFile(imagePath);
  const res = imageSize(imageBuffer);

  if (!res) throw Error(`Invalid image with src "${src}"`);
  if (!res.width) throw new Error(`Must have width for ${src}`);
  if (!res.height) throw new Error(`Must have height for ${src}`);

  const result: ImageProps = { width: res.width, height: res.height };
  return result;
}
