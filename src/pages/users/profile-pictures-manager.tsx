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

      <CardContent className="mt-4 px-0">
        <div className="flex flex-wrap gap-4">
          {profilePictures.map((image, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={image.url}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
