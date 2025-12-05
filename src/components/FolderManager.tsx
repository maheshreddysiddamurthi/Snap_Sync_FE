'use client';

import { useState, useEffect } from 'react';
import { useFolderService } from '@/hooks/useFolderService';
import { Folder } from '@/services/folderService';
import { FolderPlusIcon, FolderIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface FolderManagerProps {
  parentFolderId?: string;
}

export default function FolderManager({ parentFolderId }: FolderManagerProps) {
  const { createFolder, getFolders, deleteFolder } = useFolderService();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [creating, setCreating] = useState(false);

  const loadFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFolders(parentFolderId);
      setFolders(response.folders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, [parentFolderId]);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      setError('Please enter a folder name');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await createFolder({
        name: folderName.trim(),
        parentFolderId,
      });

      setFolders(prev => [response.folder, ...prev]);
      setCreateModalOpen(false);
      setFolderName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Are you sure you want to delete this folder?')) {
      return;
    }

    try {
      await deleteFolder(folderId);
      setFolders(prev => prev.filter(folder => folder.id !== folderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete folder');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {parentFolderId ? 'Subfolders' : 'Folders'}
        </h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FolderPlusIcon className="h-5 w-5" />
          Create Folder
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading folders...</p>
        </div>
      )}

      {/* Folders List */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <FolderIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No folders yet. Create your first folder!</p>
            </div>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FolderIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">{folder.name}</h3>
                      <p className="text-sm text-gray-500">
                        Created {new Date(folder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete folder"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Folder Modal */}
      <Transition appear show={createModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setCreateModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FolderPlusIcon className="h-6 w-6 text-blue-600" />
                  Create New Folder
                </Dialog.Title>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter folder name"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateFolder}
                    disabled={creating || !folderName.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {creating ? 'Creating...' : 'Create Folder'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
