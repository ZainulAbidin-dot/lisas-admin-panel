import { useState } from 'react';

import { SaveIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

type TProfilePic = {
  url: string;
  id: string;
};

export function ProfilePictureManager({
  initialImages,
}: {
  initialImages: TProfilePic[];
}) {
  const form = useForm();
  const [profilePictures, setProfilePictures] =
    useState<TProfilePic[]>(initialImages);
  const [newBase64Images, setNewBase64Images] = useState<TProfilePic[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileReaders: Promise<string>[] = [];

    for (const file of files) {
      const reader = new FileReader();
      fileReaders.push(
        new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      );
    }

    Promise.all(fileReaders).then((base64Images) => {
      setNewBase64Images((prev) => {
        return [
          ...prev,
          ...base64Images.map((base64Image) => ({
            id: generateRandomId(),
            url: base64Image,
          })),
        ];
      });
    });
  };

  const handleDelete = async (imageId: string) => {
    const isNewImage = newBase64Images.find((img) => img.id === imageId);

    if (isNewImage) {
      setNewBase64Images((prev) => prev.filter((img) => img.id !== imageId));
    } else {
      // Call API to delete the image
      setProfilePictures((prev) => prev.filter((img) => img.id !== imageId));
    }
  };

  const onSubmit = () => {
    console.log('Uploading images:', newBase64Images); // Send only base64 images to backend
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="p-6 bg-transparent">
      <h2 className="text-3xl font-bold mb-2">Profile Pictures</h2>
      <p className="text-gray-500 text-sm">Manage your profile pictures.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="mt-4 px-0">
            <FormItem>
              <FormLabel>Profile Pictures</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-4">
                  {profilePictures
                    .concat(newBase64Images)
                    .map((image, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={image.url}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                          onClick={() => handleDelete(image.id)}
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
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </FormControl>
            </FormItem>
          </CardContent>

          <Separator />
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              className="hover:bg-[hsl(var(--primary-hover))]"
              disabled={isSubmitting}
            >
              <SaveIcon className="size-4" />
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}

function generateRandomId() {
  return Math.random().toString(36).substring(2, 15);
}
