import { Card, CardContent } from '@/components/ui/card';

import {
  TProfilePic,
  useProfilePicturesManager,
} from './_hooks/use-profile-pictures-manager';

export function ProfilePictureManager({
  initialImages,
}: {
  initialImages: TProfilePic[];
}) {
  const { profilePictures } = useProfilePicturesManager(initialImages);

  return (
    <Card className="bg-transparent p-6">
      <h2 className="mb-2 text-3xl font-bold">Profile Pictures</h2>

      <CardContent className="mt-4 px-0">
        <div className="flex flex-wrap gap-4">
          {profilePictures.length > 0 ? (
            profilePictures.map((image, index) => (
              <div key={index} className="relative h-24 w-24">
                <img
                  src={image.url}
                  alt="Profile"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No profile pics uploaded.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
