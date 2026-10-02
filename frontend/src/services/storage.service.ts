export const storageService = {
  uploadReportImage: async (userId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const response = await fetch('https://api.imgbb.com/1/upload?key=' + apiKey, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to ImgBB');
    }

    const data = await response.json();
    return data.data.url;
  }
};
