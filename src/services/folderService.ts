interface Folder {
  id: string;
  name: string;
  userId: string;
  parentFolderId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateFolderRequest {
  name: string;
  parentFolderId?: string;
}

interface CreateFolderResponse {
  message: string;
  folder: Folder;
}

interface GetFoldersResponse {
  folders: Folder[];
}

class FolderService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    // This method is deprecated - use useFolderService hook instead
    return {
      'Content-Type': 'application/json',
    };
  }

  async createFolder(data: CreateFolderRequest): Promise<CreateFolderResponse> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseUrl}/api/create-folder`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create folder');
    }

    return response.json();
  }

  async getFolders(parentFolderId?: string): Promise<GetFoldersResponse> {
    const headers = await this.getAuthHeaders();

    const url = new URL(`${this.baseUrl}/api/folders`);
    if (parentFolderId) {
      url.searchParams.append('parentFolderId', parentFolderId);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch folders');
    }

    return response.json();
  }

  async deleteFolder(folderId: string): Promise<{ message: string }> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseUrl}/api/folder/${folderId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete folder');
    }

    return response.json();
  }
}

export const folderService = new FolderService();
export type { Folder, CreateFolderRequest, CreateFolderResponse, GetFoldersResponse };

