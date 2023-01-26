// Similiar structure to:
// https://github.com/JS-DevTools/rehype-inline-svg/blob/master/src/inline-svg.ts
import { readFile } from "fs/promises";
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

  const width = imageBuffer.at(0) || 0;
  const height = imageBuffer.at(1) || 1;

  const result: ImageProps = { width, height };
  return result;
}
