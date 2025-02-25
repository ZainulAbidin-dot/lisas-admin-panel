import React from 'react';

import { Trash2Icon } from 'lucide-react';

import { ButtonWithLoader } from '@/components/composed/button-with-loader';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAxiosDelete } from '@/hooks/use-axios-delete';

type TProfilePic = {
  url: string;
  id: string;
};

export function ProfilePictureManager({
  initialImages,
  userId,
}: {
  initialImages: TProfilePic[];
  userId: string;
}) {
  const [profilePictures, setProfilePictures] =
    React.useState<TProfilePic[]>(initialImages);

  return (
    <Card className="bg-transparent p-6">
      <h2 className="mb-2 text-3xl font-bold">Profile Pictures</h2>

      <CardContent className="mt-4 px-0">
        <div className="flex flex-wrap gap-4">
          {profilePictures.length > 0 ? (
            profilePictures.map((profilePic) => (
              <ProfilePicture
                key={profilePic.id}
                profilePic={profilePic}
                userId={userId}
                onDeleteSuccess={(id) =>
                  setProfilePictures((prev) =>
                    prev.filter((pic) => pic.id !== id)
                  )
                }
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No profile pics uploaded.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfilePicture({
  profilePic,
  userId,
  onDeleteSuccess,
}: {
  profilePic: TProfilePic;
  userId: string;
  onDeleteSuccess: (id: string) => void;
}) {
  const onDelete = React.useCallback(() => {
    onDeleteSuccess(profilePic.id);
  }, [profilePic.id, onDeleteSuccess]);

  const { isDeleting, deleteFn } = useAxiosDelete({
    url: `/admin/users/${userId}/profile-image`,
    onSuccessCallback: onDelete,
  });

  const handleDeleteBtnClick = () => {
    deleteFn({ userId: userId, profilePicId: profilePic.id });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <img
          src={profilePic.url}
          alt="Profile"
          className="h-24 w-24 rounded-lg object-cover"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid h-full w-full pt-4">
          <img
            src={profilePic.url}
            alt="Profile"
            className="h-full w-full rounded-lg object-cover"
            loading="lazy"
          />
        </div>
        <DialogFooter>
          <ButtonWithLoader
            variant="destructive"
            onClick={handleDeleteBtnClick}
            isLoading={isDeleting}
            initialText="Delete"
            loadingText="Deleting..."
            initialIcon={<Trash2Icon />}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
