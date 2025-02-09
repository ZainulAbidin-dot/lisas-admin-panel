import {
  HeadsetIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  MessageSquareTextIcon,
  UserSearchIcon,
  XIcon,
} from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

import { useLogout } from '@/auth/_hooks/use-logout';
import {
  SidebarHeader,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Button } from '../ui/button';
import { Footer } from './footer';
import { Navbar } from './navbar';

export const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/profile/show',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Profile Match',
    url: '/profile/find-match',
    icon: UserSearchIcon,
  },
  {
    title: 'Chat',
    url: '/chat',
    icon: MessageSquareTextIcon,
  },
  {
    title: 'Help & Support',
    url: '#',
    icon: HeadsetIcon,
  },
];

export function AppSidebar() {
  const { toggleSidebar, open, isMobile } = useSidebar();
  const logout = useLogout();
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar">
      <SidebarHeader className="bg-primary text-primary-foreground h-20">
        {isMobile ? (
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              title={open ? 'Close sidebar' : 'Open sidebar'}
            >
              {open ? (
                <XIcon className="!size-8" />
              ) : (
                <MenuIcon className="!size-8" />
              )}
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

              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout}>
                  <LogOutIcon />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
