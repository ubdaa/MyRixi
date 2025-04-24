// lib/fetchSwagger.ts
import fs from 'fs';
import path from 'path';

export async function fetchSwagger(apiUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/swagger/v1/swagger.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Swagger: ${response.statusText}`);
    }
    
    const swaggerData = await response.json();
    
    // Assurez-vous que le répertoire existe
    const directory = path.join(process.cwd(), 'public', 'api-docs');
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // Écrivez le fichier swagger.json
    fs.writeFileSync(
      path.join(directory, 'swagger.json'),
      JSON.stringify(swaggerData, null, 2)
    );
    
    console.log('Swagger file successfully downloaded and saved');
    return true;
  } catch (error) {
    console.error('Error fetching swagger file:', error);
    return false;
  }
}