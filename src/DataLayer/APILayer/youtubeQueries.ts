import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface DownloadYoutubeResponse {
    message: string;
    fileUrl?: string; // Optional, depends on actual API response
    [key: string]: any;
}

interface DownloadYoutubeVariables {
    url: string;
}

const downloadYoutubeMusic = async ({ url }: DownloadYoutubeVariables): Promise<DownloadYoutubeResponse> => {
    // Using the Gomedia API endpoint as requested
    const response = await axios.post<DownloadYoutubeResponse>(
        '/gomedia/api/download-music',
        { url },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return response.data;
};

export const useDownloadYoutubeMusicMutation = () => {
    return useMutation({
        mutationFn: downloadYoutubeMusic,
    });
};
