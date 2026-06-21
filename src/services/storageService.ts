import { getImgbbApiKey } from '../config/env';

const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

/**
 * Converte um File para base64 (sem o prefixo data:...).
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove o prefixo "data:image/...;base64,"
      const base64 = result.split(',')[1];
      if (!base64) {
        reject(new Error('Falha ao converter imagem para base64.'));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Faz upload de uma imagem para o ImgBB e retorna a URL pública.
 */
export async function uploadImage(file: File): Promise<string> {
  const apiKey = getImgbbApiKey();
  const base64 = await fileToBase64(file);

  const formData = new FormData();
  formData.append('key', apiKey);
  formData.append('image', base64);
  formData.append('name', `${Date.now()}-${file.name}`);

  const response = await fetch(IMGBB_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erro no upload da imagem: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? 'Erro desconhecido ao fazer upload da imagem.');
  }

  return json.data.display_url as string;
}

/**
 * Faz upload de múltiplas fotos de ocorrência para o ImgBB.
 * Retorna um array com as URLs públicas.
 */
export async function uploadOccurrencePhotos(
  files: File[],
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadImage(file)));
}
