import { SaveIcon, X } from 'lucide-react';

import { ButtonWithLoader } from '@/components/composed/button-with-loader';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import {
  TProfilePic,
  useProfilePicturesManager,
} from './_hooks/use-profile-pictures-manager';

export function ProfilePictureManager({
  initialImages,
}: {
  initialImages: TProfilePic[];
}) {
  const {
    componentState,
    profilePictures,
    handleImagesSelect,
    handleDelete,
    handleUploadProfileImages,
  } = useProfilePicturesManager(initialImages);

  const buttonText =
    componentState === 'deleting'
      ? 'Deleting'
      : componentState === 'uploading'
        ? 'Uploading'
        : componentState === 'processing'
          ? 'Processing'
          : 'Save';

  return (
    <Card className="p-6 bg-transparent">
      <h2 className="text-3xl font-bold mb-2">Profile Pictures</h2>
      <p className="text-gray-500 text-sm">Manage your profile pictures.</p>

      <CardContent className="mt-4 px-0">
        <div className="flex flex-wrap gap-4">
          {profilePictures.map((image, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={image.url}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 disabled:cursor-not-allowed"
                onClick={() => handleDelete(image.id)}
                disabled={componentState !== 'idle'}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100">
            +
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImagesSelect}
              disabled={componentState !== 'idle'}
            />
          </label>
        </div>
      </CardContent>

      <Separator />
      <div className="flex justify-end mt-4">
        <ButtonWithLoader
          className="hover:bg-[hsl(var(--primary-hover))]"
          isLoading={componentState !== 'idle'}
          loadingText={buttonText}
          initialText="Save"
          initialIcon={<SaveIcon className="size-4" />}
          onClick={handleUploadProfileImages}
        />
      </div>
    </Card>
  );
}
