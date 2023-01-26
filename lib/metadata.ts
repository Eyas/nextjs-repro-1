// Similiar structure to:
// https://github.com/JS-DevTools/rehype-inline-svg/blob/master/src/inline-svg.ts
import imageSize from "image-size";
import path from "path";
import { promisify } from "util";
import sharp from "sharp";
import { readFile } from "fs/promises";

const sizeOf = promisify(imageSize);
const BLUR_IMG_SIZE = 8;
const BLUR_QUALITY = 70;

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
  const res = await sizeOf(imagePath);

  if (!res) throw Error(`Invalid image with src "${src}"`);
  if (!res.width) throw new Error(`Must have width for ${src}`);
  if (!res.height) throw new Error(`Must have height for ${src}`);

  const result: ImageProps = { width: res.width, height: res.height };

  const imageBlurExt = imagePath.match(/\.(png|webp|jpg|jpeg)$/);
  if (imageBlurExt && res.width && res.height) {
    // Compure Blur URL for these types of images.
    // This code is based on next/build/webpack/loaders/next-image-loader.js
    // Shrink the image's largest dimension
    const dimension = res.width >= res.height ? "width" : "height";
    const extension = imageBlurExt[1].replace("jpg", "jpeg");

    const content = await readFile(imagePath);

    const resizedImage = await resizeImage(
      content,
      dimension,
      BLUR_IMG_SIZE,
      extension,
      BLUR_QUALITY
    );
    const blurDataURL = `data:image/${extension};base64,${resizedImage.toString(
      "base64"
    )}`;
    (result as RichDim).blurDataURL = blurDataURL;
  }

  return result;
}

// This code is based on next/server/image-optimizer.ts
async function resizeImage(
  content: Buffer,
  dimension: "width" | "height",
  size: number,
  extension: string,
  quality: number
): Promise<Buffer> {
  const transformer = sharp(content);
  switch (extension) {
    case "webp":
      transformer.webp({ quality });
      break;
    case "png":
      transformer.png({ quality });
      break;
    case "jpeg":
      transformer.jpeg({ quality });
      break;
    default:
      throw new Error("unsupported " + extension);
  }

  if (dimension === "width") {
    transformer.resize(size);
  } else if (dimension === "height") {
    transformer.resize(null, size);
  }
  return await transformer.toBuffer();
}
