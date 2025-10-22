"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconLibraryPlus,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { User } from "@/app/types/definition"
import Link from "next/link"
import Logo from "@/app/ui/Logo"
import { BookPlus } from "lucide-react"



interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      href: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: IconListDetails,
    },
    {
      title: "Order",
      href: "/admin/order",
      icon: IconChartBar,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Refund Request",
      href: "/admin/refunds",
      icon: IconFolder,
    },
    {
      title: "Content Management",
      href: "/admin/content-management",
      icon: IconLibraryPlus,
    }
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      href: "#",
      items: [
        {
          title: "Active Proposals",
          href: "#",
        },
        {
          title: "Archived",
          href: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      href: "#",
      items: [
        {
          title: "Active Proposals",
          href: "#",
        },
        {
          title: "Archived",
          href: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      href: "#",
      items: [
        {
          title: "Active Proposals",
          href: "#",
        },
        {
          title: "Archived",
          href: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      href: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      href: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      href: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      href: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      href: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      href: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const userData = user;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 "
            >
              <a href="/admin" className="flex h-full justify-start">
                <Logo size="nav"/>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
