import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { UserAvatar } from './_user-avatar/user-avatar';

export function ShowProfilePage() {
  return (
    <div className="flex-grow w-full">
      <div className="w-full max-w-7xl mx-auto py-6 px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <UserAvatar
              name="Siddiq Ahmed"
              profileImage="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              isVerified={true}
              profileCompletionPercentage={80}
            />
          </div>

          <Accordion type="single" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="w-full py-4 px-2">
                Is it accessible?
              </AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if
                you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
