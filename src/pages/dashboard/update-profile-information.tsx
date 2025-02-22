import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import {
  TUpdateUserProfile,
  updateUserProfileSchema,
  useUpdateProfileInformation,
} from './_hooks/use-update-profile-information';

export function UpdateProfileInformation({
  userProfile,
}: {
  userProfile: TUpdateUserProfile;
}) {
  const form = useForm({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      ...userProfile,
      idVerification: '',
    },
  });

  const [idVerificationPreview, setIdVerificationPreview] = useState<string>(
    userProfile.idVerification || ''
  );

  const { updateProfileInformation, isSubmitting } =
    useUpdateProfileInformation();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === 'string') {
        console.log('Upading...');
        form.setValue('idVerification', reader.result);
        setIdVerificationPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="bg-transparent p-6 shadow-sm">
      <h2 className="mb-2 text-3xl font-bold">User Profile</h2>
      <p className="text-sm text-gray-500">Tell us more about yourself.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(updateProfileInformation)}>
          <CardContent className="mt-4 grid grid-cols-1 gap-4 px-0 md:grid-cols-2">
            {/* Meeting Preference */}
            <FormField
              control={form.control}
              name="meetingPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Communication</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="phone" />
                        </FormControl>
                        <FormLabel className="!mt-0">Phone</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="penpal" />
                        </FormControl>
                        <FormLabel className="!mt-0">Penpal</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="chat" />
                        </FormControl>
                        <FormLabel className="!mt-0">Chat</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feels Lonely */}
            <FormField
              control={form.control}
              name="feelsLonely"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you feel lonely?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="!mt-0">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="!mt-0">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Age</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-transparent">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="under-18">Under 18</SelectItem>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45-54">45-54</SelectItem>
                      <SelectItem value="55-64">55-64</SelectItem>
                      <SelectItem value="65-or-older">65 or older</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Self Description */}
            <FormField
              control={form.control}
              name="selfDescription"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Describe Yourself</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-transparent"
                      placeholder="A little about yourself"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discussion Topics */}
            <FormField
              control={form.control}
              name="discussionTopics"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Topics You Like to Discuss</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-transparent"
                      placeholder="Your favorite topics"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Friend Expectations */}
            <FormField
              control={form.control}
              name="friendExpectations"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>What Do You Expect from a Friend?</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-transparent"
                      placeholder="Your expectations"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ID Verification */}
            <FormField
              control={form.control}
              name="idVerification"
              render={() => (
                <FormItem className="md:col-span-2">
                  <FormLabel>ID Verification</FormLabel>
                  <Input
                    className="bg-transparent"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageUpload}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          {/* Preview Image For ID Verification */}
          <div className="mb-6 mt-2">
            {idVerificationPreview && (
              <div className="h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={idVerificationPreview}
                  alt="Profile Image"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="mt-4 flex justify-end">
            <Button type="submit" className="" disabled={isSubmitting}>
              <SaveIcon />
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
