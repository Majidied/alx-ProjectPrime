import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadAvatar } from '../api/userApi';
import { useState } from 'react';

interface Notification {
    type: 'error' | 'success';
    message: string;
    visible: boolean;
}

export const useUploadAvatar = () => {
    const queryClient = useQueryClient();
    const [previewUrl, setPreviewUrl] = useState<string | undefined>('');
    const [notification, setNotification] = useState<Notification>({
        type: 'error',
        message: '',
        visible: false,
    });

    const { mutate: upload, isPending: isLoading } = useMutation<object, Error, File>({
        mutationFn: (file: File) => uploadAvatar(file),
        onSuccess: () => {
            setNotification({
                type: 'success',
                message: 'Avatar uploaded successfully.',
                visible: true,
            });
            queryClient.invalidateQueries({ queryKey: ['userAvatar'] });
        },
        onError: (error: unknown) => {
            if (error instanceof Error) {
                setNotification({
                    type: 'error',
                    message: error.message,
                    visible: true,
                });
            }
        },
    }
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            // compress size and make it rectangle
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            upload(file);
        }
    };

    return { previewUrl, handleFileChange, isLoading, notification, setNotification };
};