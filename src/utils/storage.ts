'use server'

import path from 'path';
import fs from 'fs/promises';

export async function storeImageToDisk(file: File, namePrefix: string, nameSuffix: string | number) {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  const filename = `${namePrefix}-${nameSuffix}-${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`;
    
  const filePath = process.env.STORAGE_IMAGE_PATH + filename;

  await fs.writeFile(path.join(process.env.STORAGE_IMAGE_DIRECTORY!, filePath), buffer);

  return filePath;
}

export async function deleteImageFromDisk(filePath: string) {
  await fs.rm(path.join(process.env.STORAGE_IMAGE_DIRECTORY!, filePath));
}
