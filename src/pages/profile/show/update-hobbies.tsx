import { SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { TUpdateHobbies, useUpdateHobbies } from './_hooks/use-update-hobbies';

const hobbiesList = [
  { label: 'Reading', value: 'reading' },
  { label: 'Listening to Music', value: 'listening-to-music' },
  { label: 'Arts & Crafts', value: 'arts-and-crafts' },
  { label: 'Going for Walks', value: 'going-for-walks' },
  { label: 'Yoga & Meditation', value: 'yoga-and-meditation' },
  { label: 'Traveling', value: 'traveling' },
  { label: 'Gardening', value: 'gardening' },
  {
    label: 'Playing Board Games & Cards',
    value: 'playing-board-games-and-cards',
  },
  { label: 'Cooking & Baking', value: 'cooking-and-baking' },
  { label: 'Watching Classic Movies', value: 'watching-classic-movies' },
];

export function UpdateHobbies({
  hobbies,
}: {
  hobbies: TUpdateHobbies['hobbies'];
}) {
  const form = useForm<TUpdateHobbies>({
    defaultValues: {
      hobbies: hobbies ?? [],
    },
  });

  const { watch, setValue } = form;
  const selectedHobbies = watch('hobbies');

  const toggleHobby = (hobby: string) => {
    const updatedHobbies = selectedHobbies.includes(hobby)
      ? selectedHobbies.filter((h) => h !== hobby)
      : [...selectedHobbies, hobby];

    if (updatedHobbies.length > 5) return;
    setValue('hobbies', updatedHobbies);
  };

  const { updateHobbies, isSubmitting } = useUpdateHobbies();

  return (
    <Card className="p-6 bg-transparent">
      <h2 className="text-3xl font-bold mb-2">User Hobbies</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(updateHobbies)}>
          <CardContent className="mt-4 px-0">
            <FormField
              control={form.control}
              name="hobbies"
              render={() => (
                <FormItem>
                  <FormLabel>Hobbies (Choose up to 5)</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {hobbiesList.map((hobby) => (
                        <Badge
                          key={hobby.value}
                          onClick={() => toggleHobby(hobby.value)}
                          className={cn(
                            'cursor-pointer px-3 py-1 rounded-lg transition-colors',
                            selectedHobbies.includes(hobby.value)
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                              : 'bg-gray-200 text-gray-700 hover:bg-accent'
                          )}
                        >
                          {hobby.label}
                        </Badge>
                      ))}
                    </div>
                  </FormControl>
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

  /*
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="hobbies"
          render={() => (
            <FormItem>
              <FormLabel>Hobbies (Choose up to 5)</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {hobbiesList.map((hobby) => (
                    <Badge
                      key={hobby}
                      onClick={() => toggleHobby(hobby)}
                      className={cn(
                        'cursor-pointer px-3 py-1 rounded-lg transition-colors',
                        selectedHobbies.includes(hobby)
                          ? 'bg-green-700 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      )}
                    >
                      {hobby}
                    </Badge>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
  */
}
