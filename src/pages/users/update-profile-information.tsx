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

  return (
    <Card className="p-6 bg-transparent shadow-sm">
      <h2 className="text-3xl mb-2 font-bold">User Profile</h2>
      <p className="text-gray-500 text-sm">Tell us more about yourself.</p>

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault() /** Prevent form submission */}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-0">
            {/* Meeting Preference */}
            <FormField
              control={form.control}
              name="meetingPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Communication</FormLabel>
                  <FormControl>
                    <RadioGroup defaultValue={field.value} className="flex gap-4">
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="phone" disabled />
                        </FormControl>
                        <FormLabel className="!mt-0">Phone</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="penpal" disabled />
                        </FormControl>
                        <FormLabel className="!mt-0">Penpal</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="chat" disabled />
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
                    <RadioGroup defaultValue={field.value} className="flex gap-4">
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="yes" disabled />
                        </FormControl>
                        <FormLabel className="!mt-0">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="no" disabled />
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
                  <Select defaultValue={field.value} disabled>
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
                    <Textarea className="bg-transparent" disabled {...field} />
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
                    <Textarea className="bg-transparent" disabled {...field} />
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
                    <Textarea className="bg-transparent" disabled {...field} />
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
                  <Input className="bg-transparent" type="file" disabled />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          {/* Preview Image For ID Verification */}
          <div className="mt-2 mb-6">
            {idVerificationPreview && (
              <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={idVerificationPreview}
                  alt="Profile Image"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
}
