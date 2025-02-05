import React from "react";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubItem,
   SidebarTrigger
} from "@/components/ui/sidebar";
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { SidebarProvider } from "@/components/ui/sidebar";

// Menu items.
const items = [
   {
       title: "Home",
       url: "#",
       icon: Home,
   },
   {
       title: "Inbox",
       url: "#",
       icon: Inbox,
   },
   {
       title: "Calendar",
       url: "#",
       icon: Calendar,
   },
   {
       title: "Search",
       url: "#",
       icon: Search,
   },
   {
       title: "Settings",
       url: "#",
       icon: Settings,
   },
];

export function AppSidebar() {
   const [open, setOpen] = React.useState(false)

   return (   
       <SidebarProvider open={open} onOpenChange={setOpen}>
            <Sidebar collapsible="icon">
                <SidebarContent>
                <SidebarGroup>
                     <SidebarGroupLabel>Application</SidebarGroupLabel>
                     <SidebarGroupContent>
                         <SidebarMenu>
                              <Collapsible defaultOpen className="group/collapsible">
                                  <SidebarMenuItem>
                                       <CollapsibleTrigger asChild>
                                           <SidebarMenuButton>
                                                <span>Dropdown</span>
                                           </SidebarMenuButton>
                                       </CollapsibleTrigger>
                                       <CollapsibleContent>
                                           <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <a href="#">Sub Item 1</a>
                                                </SidebarMenuSubItem>
                                                <SidebarMenuSubItem>
                                                    <a href="#">Sub Item 2</a>
                                                </SidebarMenuSubItem>
                                           </SidebarMenuSub>
                                       </CollapsibleContent>
                                  </SidebarMenuItem>
                              </Collapsible>
                              {items.map((item) => (
                                  <SidebarMenuItem key={item.title}>
                                       <SidebarMenuButton asChild>
                                           <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                           </a>
                                       </SidebarMenuButton>
                                  </SidebarMenuItem>
                              ))}
            <SidebarTrigger>
                <button onClick={() => setOpen(!open)}>Toggle Sidebar</button>
            </SidebarTrigger>
                         </SidebarMenu>
                     </SidebarGroupContent>
                </SidebarGroup>
                </SidebarContent>
            </Sidebar>
       </SidebarProvider>
   );
}

export function App() {
   return (
       <SidebarProvider>
           <AppSidebar />
       </SidebarProvider>
   );
}