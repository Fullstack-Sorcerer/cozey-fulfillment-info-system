import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../data');

export const readJson = async (fileName: string) => {
  const filePath = path.join(dataDir, `${fileName}.json`);

  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    throw new Error(`Error reading file ${fileName}.json: ${error.message}`);
  }
};