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
    <Card className="bg-transparent p-6">
      <h2 className="mb-2 text-3xl font-bold">Profile Pictures</h2>
      <p className="text-sm text-gray-500">Manage your profile pictures.</p>

      <CardContent className="mt-4 px-0">
        <div className="flex flex-wrap gap-4">
          {profilePictures.map((image, index) => (
            <div key={index} className="relative h-24 w-24">
              <img
                src={image.url}
                alt="Profile"
                className="h-full w-full rounded-lg object-cover"
              />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white disabled:cursor-not-allowed"
                onClick={() => handleDelete(image.id)}
                disabled={componentState !== 'idle'}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-400 hover:bg-gray-100">
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
      <div className="mt-4 flex justify-end">
        <ButtonWithLoader
          className=""
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
