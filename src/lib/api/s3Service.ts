import axiosClient from './axiosClient';

export const getS3PresignedURL = async (fileName: string):Promise<string> => {
    try {
        const response = await axiosClient.get<{ url: string }>(`/communications/getPresignedURL?fileName=${fileName}`); 
        return response.data.url;
    } catch (error) {
        console.error("Error retrieving presigned link:", error);
        throw error;
    }
}