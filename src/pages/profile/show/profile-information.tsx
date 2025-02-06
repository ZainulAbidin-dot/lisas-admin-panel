import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

const userProfileSchema = z.object({
  meetingPreference: z.enum(['phone', 'penpal', 'chat']),
  feelsLonely: z.enum(['yes', 'no']),
  chatFrequency: z.enum([
    'multiple-times-a-week',
    'once-a-week',
    'once-a-month',
    'once-every-three-months',
  ]),
  city: z.string().min(1, 'City is required').max(50),
  age: z.enum([
    'under-18',
    '18-24',
    '25-34',
    '35-44',
    '45-54',
    '55-64',
    '65-or-older',
  ]),
  selfDescription: z.string().min(1, 'This field is required').max(255),
  discussionTopics: z.string().min(1, 'This field is required').max(255),
  friendExpectations: z.string().min(1, 'This field is required').max(255),
  idVerification: z
    .string()
    .refine((base64String) => {
      if (!base64String) return true;
      const matches = base64String.match(/^data:(.+);base64,(.+)$/);
      if (!matches || matches.length !== 3) return false;
      const mimeType = matches[1];
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(mimeType);
    }, 'Invalid image format')
    .optional(),
});

type TUserProfile = z.infer<typeof userProfileSchema>;

export function ProfileInformation({
  userProfile,
}: {
  userProfile: TUserProfile;
}) {
  const form = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: userProfile,
  });

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
        form.setValue('idVerification', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: TUserProfile) => {
    console.log('Submitted Data:', data);
  };

  return (
    <Card className="p-6 bg-transparent shadow-sm">
      <h2 className="text-3xl mb-2 font-bold">User Profile</h2>
      <p className="text-gray-500 text-sm">Tell us more about yourself.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-0">
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

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-transparent"
                      placeholder="Enter city"
                      {...field}
                    />
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
                <FormItem>
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

          <Separator />

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              className="hover:bg-[hsl(var(--primary-hover))]"
            >
              <SaveIcon />
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
