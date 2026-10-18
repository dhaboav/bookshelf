import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import path from 'node:path';

import { IMAGE_CONFIG } from './image-config';

type ValidationResult = { success: boolean; message?: string };

// ==========================================
// Helpers
async function isValidImage(buffer: Buffer): Promise<boolean> {
  // JPEG signature
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG signature
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return true;
  }

  // AVIF signature: ftyp box with an avif/avis brand
  if (buffer.length >= 16 && buffer.toString('ascii', 4, 8) === 'ftyp') {
    const boxSize = buffer.readUInt32BE(0);

    if (boxSize >= 16 && boxSize <= buffer.length) {
      for (let i = 8; i + 4 <= Math.min(boxSize, 64); i += 4) {
        const brand = buffer.toString('ascii', i, i + 4);

        if (brand === 'avif' || brand === 'avis') {
          return true;
        }
      }
    }
  }

  return false;
}

// ==========================================
// Core logic
async function imageValidator(image: File): Promise<ValidationResult> {
  if (!IMAGE_CONFIG.ALLOWED_TYPES.has(image.type)) {
    return {
      success: false,
      message: 'Not allowed type (JPEG, PNG, AVIF only)',
    };
  }

  if (image.size === 0 || image.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
    return {
      success: false,
      message: 'Size must be greater than 0 and no more than 2 MB',
    };
  }

  return { success: true };
}

async function ImageProcessing(image: File, buffer: Buffer): Promise<ValidationResult> {
  const isImg = await isValidImage(buffer);

  if (!isImg) {
    return {
      success: false,
      message: 'File is not a supported image',
    };
  }

  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/avif': 'avif',
  };

  const extension = extensions[image.type];
  const filename = `${randomUUID()}.${extension}`;
  const directory = path.join(process.cwd(), IMAGE_CONFIG.UPLOAD_DIR);

  try {
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(path.join(directory, filename), buffer, { flag: 'wx' });
    return { success: true, message: filename };
  } catch {
    return {
      success: false,
      message: 'Failed to save image',
    };
  }
}

export async function ImageService(image: File): Promise<ValidationResult> {
  const validation = await imageValidator(image);
  if (!validation.success) {
    return validation;
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  const result = await ImageProcessing(image, buffer);
  if (!result.success) {
    return result;
  }

  return result;
}
