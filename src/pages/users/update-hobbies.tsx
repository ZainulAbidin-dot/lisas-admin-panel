import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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

  const { watch } = form;
  const selectedHobbies = watch('hobbies');

  const { updateHobbies } = useUpdateHobbies();

  return (
    <Card className="bg-transparent p-6">
      <h2 className="mb-2 text-3xl font-bold">User Hobbies</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(updateHobbies)}>
          <CardContent className="mt-4 px-0">
            <FormField
              control={form.control}
              name="hobbies"
              render={() => (
                <FormItem>
                  <FormLabel>Hobbies (Selection Disabled)</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {hobbiesList.map((hobby) => (
                        <Badge
                          key={hobby.value}
                          className={cn(
                            'pointer-events-none rounded-lg px-3 py-1 transition-colors',
                            selectedHobbies.includes(hobby.value)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gray-200 text-gray-700'
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
        </form>
      </Form>
    </Card>
  );
}
