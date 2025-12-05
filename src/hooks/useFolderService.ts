import { useAuth0 } from '@auth0/auth0-react';
import { type CreateFolderRequest, type CreateFolderResponse, type GetFoldersResponse } from '../services/folderService';

export const useFolderService = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createFolder = async (data: CreateFolderRequest): Promise<CreateFolderResponse> => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/create-folder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create folder');
            }

            return response.json();
        } catch (error) {
            console.error('Error creating folder:', error);
            throw error;
        }
    };

    const getFolders = async (parentFolderId?: string): Promise<GetFoldersResponse> => {
        try {
            const token = await getAccessTokenSilently();
            const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/folders`);
            if (parentFolderId) {
                url.searchParams.append('parentFolderId', parentFolderId);
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch folders');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching folders:', error);
            throw error;
        }
    };

    const deleteFolder = async (folderId: string): Promise<{ message: string }> => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/folder/${folderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete folder');
            }

            return response.json();
        } catch (error) {
            console.error('Error deleting folder:', error);
            throw error;
        }
    };

    return {
        createFolder,
        getFolders,
        deleteFolder,
    };
};
