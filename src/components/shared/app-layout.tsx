import React from 'react';

import {
  BriefcaseBusinessIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  PanelLeftIcon,
  UserSearchIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';

import { Button } from '../ui/button';
import { Footer } from './footer';
import { Navbar } from './navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <div className="w-full">
        <div className="flex min-h-screen min-h-svh flex-col">
          <Navbar />
          <main className="flex flex-grow flex-col">{children}</main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Users',
    url: '/users',
    icon: UserSearchIcon,
  },
  {
    title: 'Subscriptions',
    url: '/subscription',
    icon: BriefcaseBusinessIcon,
  },
  {
    title: 'Chat',
    url: '/chat',
    icon: MessageSquareTextIcon,
  },
];

export function AppSidebar() {
  const { toggleSidebar, open, isMobile } = useSidebar();
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar">
      <SidebarHeader className="h-20 bg-primary text-primary-foreground">
        {isMobile ? (
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              title={open ? 'Close sidebar' : 'Open sidebar'}
            >
              <PanelLeftIcon className="!size-8" />
            </Button>
          </div>
        ) : null}
      </SidebarHeader>
      <SidebarContent className="bg-primary text-primary-foreground">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
