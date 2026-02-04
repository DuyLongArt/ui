import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = '/backend/widgets';

export interface WidgetFolder {
    id: number;
    folderName: string;
    identity_id?: number;
}

export interface WidgetShortcut {
    id: number;
    shortcutName: string;
    shortcutUrl: string;
    folder?: WidgetFolder;
}

// Fetchers
const fetchFolders = async () => {
    const token = Cookies.get('auth_jwt');
    const { data } = await axios.get<WidgetFolder[]>(`${API_BASE_URL}/folders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return data;
};

const fetchShortcutsByFolder = async (folderId: number) => {
    const token = Cookies.get('auth_jwt');
    const { data } = await axios.get<WidgetShortcut[]>(`${API_BASE_URL}/folder/${folderId}/shortcuts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return data;
};

// Hooks
export const useWidgetFoldersQuery = () => {
    return useQuery({
        queryKey: ['widget', 'folders'],
        queryFn: fetchFolders,
    });
};

export const useWidgetShortcutsQuery = (folderId: number | null) => {
    return useQuery({
        queryKey: ['widget', 'shortcuts', folderId],
        queryFn: () => fetchShortcutsByFolder(folderId!),
        enabled: folderId !== null,
    });
};

// Mutations
export const useAddFolderMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (folder: Partial<WidgetFolder>) => {
            const token = Cookies.get('auth_jwt');
            return axios.post(`${API_BASE_URL}/widget/folder/add`, folder, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['widget', 'folders'] });
        },
    });
};

export const useDeleteFolderMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => {
            const token = Cookies.get('auth_jwt');
            return axios.delete(`${API_BASE_URL}/widget/folder/delete/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['widget', 'folders'] });
        },
    });
};

export const useEditFolderMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, folder }: { id: number, folder: Partial<WidgetFolder> }) => {
            const token = Cookies.get('auth_jwt');
            return axios.post(`${API_BASE_URL}/widget/folder/edit/${id}`, folder, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['widget', 'folders'] });
        },
    });
};

export const useAddShortcutMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (shortcut: Partial<WidgetShortcut>) => {
            const token = Cookies.get('auth_jwt');
            return axios.post(`${API_BASE_URL}/widget/shortcut/add`, shortcut, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
        },
        onSuccess: (_, variables) => {
            if (variables.folder?.id) {
                queryClient.invalidateQueries({ queryKey: ['widget', 'shortcuts', variables.folder.id] });
            }
        },
    });
};

export const useUpdateShortcutMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, shortcut }: { id: number, shortcut: Partial<WidgetShortcut> }) => {
            const token = Cookies.get('auth_jwt');
            return axios.put(`${API_BASE_URL}/widget/shortcut/update/${id}`, shortcut, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
        },
        onSuccess: (_, variables) => {
            if (variables.shortcut.folder?.id) {
                queryClient.invalidateQueries({ queryKey: ['widget', 'shortcuts', variables.shortcut.folder.id] });
            }
        },
    });
};

export const useDeleteShortcutMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, folderId }: { id: number, folderId: number }) => {
            const token = Cookies.get('auth_jwt');
            return axios.delete(`${API_BASE_URL}/widget/shortcut/delete/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['widget', 'shortcuts', variables.folderId] });
        },
    });
};
