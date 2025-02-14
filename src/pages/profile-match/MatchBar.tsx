import { CheckIcon, MailIcon, PhoneIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/auth-store';

import {
  TMatchProfile,
  TPendingProfile,
  useProfileMatch,
} from './profile-match-context';

export function ProfileMatchSidebar() {
  const { pendingProfiles, matchedProfiles, handleDeleteMatchRequest } =
    useProfileMatch();
  const { token } = useAuthStore();

  if (!token) return null;

  const currentUserId = token.decoded.userId;

  return (
    <div className="bg-sidebar hidden md:block w-80 max-w-full flex-shrink-0 p-4 border shadow-lg">
      <Tabs defaultValue="matched">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="matched">Matched</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-2">
            {pendingProfiles.map((profile) => (
              <PendingProfileCard
                key={profile.id}
                profile={profile}
                currentUserId={currentUserId}
                onAccept={console.log}
                onDelete={handleDeleteMatchRequest}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matched">
          <div className="space-y-2">
            {matchedProfiles.map((profile) => (
              <MatchedProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MatchedProfileCard({ profile }: { profile: TMatchProfile }) {
  return (
    <Card className="p-3 rounded-xl shadow-md flex w-full min-h-[120px] items-center space-x-3">
      <img
        src={profile.profileImage}
        alt={profile.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <CardContent className="flex-1 p-0">
        <h2 className="text-md font-semibold">
          {profile.name}, {profile.age}
        </h2>
        <p className="text-gray-500 text-sm">{profile.city}</p>
        <div className="flex gap-1 mt-2 justify-end">
          <Button variant="default" size="sm" className="w-8 h-8">
            <MailIcon className="w-4 h-4" />
            <span className="sr-only">Send Message</span>
          </Button>
          <Button variant="secondary" size="sm" className="w-8 h-8">
            <PhoneIcon className="w-4 h-4" />
            <span className="sr-only">Call</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PendingProfileCard({
  profile,
  currentUserId,
  onAccept,
  onDelete,
}: {
  profile: TPendingProfile;
  currentUserId: string;
  onAccept: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const isSender = profile.senderId === currentUserId;
  return (
    <Card className="p-3 rounded-xl shadow-md flex w-full h-[120px] items-center space-x-3">
      <img
        src={profile.profileImage}
        alt={profile.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <CardContent className="flex-1 p-0">
        <h2 className="text-md font-semibold">
          {profile.name}, {profile.age}
        </h2>
        <p className="text-gray-500 text-sm">{profile.city}</p>
        <div className="flex gap-1 mt-2 justify-end">
          {!isSender ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => onAccept(profile.id)}
            >
              <CheckIcon className="w-4 h-4" />
              <span className="sr-only">Accept</span>
            </Button>
          ) : null}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(profile.id)}
          >
            <XIcon className="w-4 h-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
