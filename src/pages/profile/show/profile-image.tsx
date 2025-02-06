import { useRef, useState } from 'react';

import { SaveIcon, UploadIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useUpdateProfileImage } from './_hooks/use-update-profile-image';

interface ProfileImageProps {
  profileImage?: string | null;
  name: string;
}

export function ProfileImage({ profileImage, name }: ProfileImageProps) {
  const [image, setImage] = useState<string | null>(profileImage || null);
  const avatarUploadRef = useRef<HTMLInputElement>(null);
  const { updateProfileImage, isSubmitting } = useUpdateProfileImage();

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.');
      return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUploadBtnClick = () => {
    avatarUploadRef.current?.click();
  };

  const handleImageUpdate = async () => {
    if (!image) return;
    await updateProfileImage(image);
  };

  return (
    <Card className="p-6 bg-transparent shadow-sm">
      <h2 className="text-3xl font-bold mb-2">Avatar</h2>
      <p className="text-gray-500 text-sm">
        Avatar is your profile picture - everyone who visits your profile will
        see this.
      </p>

      <CardContent className="flex items-center gap-4 mt-4 px-0">
        <Avatar className="w-16 h-16 border">
          <AvatarImage src={image || ''} alt="Profile" />
          <AvatarFallback className="">{getInitials(name)}</AvatarFallback>
        </Avatar>

        <label htmlFor="avatar-upload">
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageUpload}
            ref={avatarUploadRef}
          />
          <Button
            variant="outline"
            className="bg-transparent"
            onClick={handleImageUploadBtnClick}
          >
            <UploadIcon className="size-4" /> Upload
          </Button>
        </label>
      </CardContent>

      <Separator />

      <div className="flex justify-end mt-4">
        <Button
          className="hover:bg-[hsl(var(--primary-hover))]"
          disabled={isSubmitting}
          onClick={handleImageUpdate}
        >
          <SaveIcon className="size-4" />
          Save
        </Button>
      </div>
    </Card>
  );
}
