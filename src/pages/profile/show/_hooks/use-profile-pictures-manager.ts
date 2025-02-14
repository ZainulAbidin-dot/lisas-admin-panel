import React from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const VALID_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export type TProfilePic = {
  url: string;
  id: string;
};

export function useProfilePicturesManager(initialImages: TProfilePic[]) {
  const [componentState, setComponentState] = React.useState<
    'idle' | 'processing' | 'uploading' | 'deleting'
  >('idle');

  const axiosInstance = useAxiosPrivate();

  const [profilePictures, setProfilePictures] =
    React.useState<TProfilePic[]>(initialImages);
  const [newBase64Images, setNewBase64Images] = React.useState<TProfilePic[]>(
    []
  );

  const handleImagesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (componentState !== 'idle') return;

    const files = event.target.files;
    if (!files) return;

    const allowedFileTypesString = VALID_FILE_TYPES.join(', ');
    const maxFileSizeString = `${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)} MB`;

    const fileReaders: Promise<string>[] = [];

    setComponentState('processing');

    for (const file of files) {
      const fileName = file.name;

      if (!VALID_FILE_TYPES.includes(file.type)) {
        const errorMessage = `The file type of ${fileName} is not allowed. Only ${allowedFileTypesString} files are allowed.`;
        toast.error('Invalid file type', {
          description: errorMessage,
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        const errorMessage = `The file size of ${fileName} is too large. The maximum file size is ${maxFileSizeString}.`;
        toast.error('File size too large', {
          description: errorMessage,
        });
      }

      fileReaders.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      );
    }

    Promise.all(fileReaders)
      .then((base64Images) => {
        setNewBase64Images((prev) => {
          return [
            ...prev,
            ...base64Images.map((base64Image) => ({
              id: Math.random().toString(36).substring(2, 15),
              url: base64Image,
            })),
          ];
        });
      })
      .finally(() => {
        setComponentState('idle');
      });
  };

  const handleDelete = async (imageId: string) => {
    if (componentState !== 'idle') return;

    const isNewImage = newBase64Images.find((img) => img.id === imageId);

    if (isNewImage) {
      setNewBase64Images((prev) => prev.filter((img) => img.id !== imageId));
      return;
    }

    setComponentState('deleting');
    await axiosInstance
      .delete('/profile/me/profile-image', {
        data: {
          profilePicId: imageId,
        },
      })
      .then(() => {
        toast.success('Profile image deleted successfully');
        setProfilePictures((prev) => prev.filter((img) => img.id !== imageId));
      })
      .catch((error) => {
        console.error('Delete Profile Image Error: ', error);
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Unknown Error'
            : 'Unknown Error';
        toast.error(errorMessage);
      })
      .finally(() => {
        setComponentState('idle');
      });
  };

  const handleUploadProfileImages = async () => {
    if (componentState !== 'idle') return;

    try {
      setComponentState('uploading');
      const response = await axiosInstance.post('/profile/me/profile-image', {
        profileImages: newBase64Images.map((img) => img.url),
      });
      console.log('Update Profile Image Response: ', response.data);
      toast.success('Profile image updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update Profile Image Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
      return { success: false };
    } finally {
      setComponentState('idle');
    }
  };

  return {
    profilePictures: profilePictures.concat(newBase64Images),
    handleImagesSelect,
    handleDelete,
    handleUploadProfileImages,
    componentState,
  };
}
