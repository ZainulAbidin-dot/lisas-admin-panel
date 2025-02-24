import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

type TProfilePic = {
  url: string;
  id: string;
};

export function ProfilePictureManager({
  profilePictures,
}: {
  profilePictures: TProfilePic[];
}) {
  return (
    <Card className="bg-transparent p-6">
      <h2 className="mb-2 text-3xl font-bold">Profile Pictures</h2>

      <CardContent className="mt-4 px-0">
        <div className="flex flex-wrap gap-4">
          {profilePictures.length > 0 ? (
            profilePictures.map((image) => (
              <ProfilePicture url={image.url} key={image.id} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No profile pics uploaded.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfilePicture({ url }: { url: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        <img
          src={url}
          alt="Profile"
          className="h-24 w-24 rounded-lg object-cover"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid h-full w-full pt-4">
          <img
            src={url}
            alt="Profile"
            className="h-full w-full rounded-lg object-cover"
            loading="lazy"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
