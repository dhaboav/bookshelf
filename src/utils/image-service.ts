import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import path from 'node:path';

import { IMAGE_CONFIG } from './image-config';

type ImageResult = { success: true; filename: string } | { success: false; message: string };

const directory = path.resolve(process.cwd(), IMAGE_CONFIG.UPLOAD_DIR);
const publicPath = `/${IMAGE_CONFIG.UPLOAD_DIR.replace(/^public\//, '')}`;

const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/avif': 'avif',
};

// Helper func
function hasValidSignature(buffer: Buffer, type: string): boolean {
  if (type === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (type === 'image/png') {
    return (
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    );
  }

  if (type === 'image/avif') {
    if (buffer.length < 16 || buffer.toString('ascii', 4, 8) !== 'ftyp') {
      return false;
    }

    const boxSize = buffer.readUInt32BE(0);
    if (boxSize < 16 || boxSize > buffer.length) return false;

    // Major brand + compatible brands; skip the minor version field.
    for (let i = 8; i + 4 <= Math.min(boxSize, 128); i += 4) {
      if (i === 12) continue;

      const brand = buffer.toString('ascii', i, i + 4);
      if (brand === 'avif' || brand === 'avis') return true;
    }
  }

  return false;
}

// Core logic
export async function imageSave(image: File, filename: string): Promise<ImageResult> {
  const actualFilename = path.basename(filename);

  if (!Object.hasOwn(extensions, image.type)) {
    return { success: false, message: 'Unsupported image type.' };
  }

  if (image.size === 0 || image.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
    return { success: false, message: 'Invalid image size.' };
  }

  try {
    const buffer = Buffer.from(await image.arrayBuffer());

    if (
      buffer.length !== image.size ||
      buffer.length > IMAGE_CONFIG.MAX_FILE_SIZE ||
      !hasValidSignature(buffer, image.type)
    ) {
      return { success: false, message: 'Invalid image file.' };
    }

    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(path.join(directory, actualFilename), buffer, {
      flag: 'wx',
    });

    return { success: true, filename };
  } catch {
    return { success: false, message: 'Could not save image.' };
  }
}

export function imageRenaming(image: File): string | null {
  const extension = extensions[image.type];

  if (!extension) return null;

  return `${publicPath}/${randomUUID()}.${extension}`;
}

export async function imageDelete(filename: string): Promise<boolean> {
  const actualFilename = path.basename(filename);

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|avif)$/.test(
      actualFilename,
    )
  ) {
    return false;
  }

  try {
    await fs.rm(path.join(directory, actualFilename));
    return true;
  } catch {
    return false;
  }
}
