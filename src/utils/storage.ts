'use server'

import path from 'path';
import fs from 'fs/promises';

export async function storeImageToDisk(file: File, namePrefix: string, nameSuffix: string | number) {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  const filename = `${namePrefix}-${nameSuffix}${file.name.substring(file.name.lastIndexOf('.'))}`;
    
  const fileUrl = process.env.STORAGE_IMAGE_PATH + filename;

  await fs.writeFile(path.join(process.cwd(), '/public', fileUrl), buffer);

  return fileUrl;
}
