import {
  IconCamera,
  IconChartBar,
  IconClipboard,
  IconColumns3,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconHome,
  IconListDetails,
  IconPhone,
  IconPlant,
  IconReport,
  IconReportSearch,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

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
      title: "Audit Logs",
      href: "/admin/audit-logs",
      icon: IconReportSearch,
      requiresAdmin: true,
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
      name: "Home",
      href: "/admin/content-management/home",
      icon: IconHome,
    },
    {
      name: "Product",
      href: "/admin/content-management/product",
      icon: IconPlant,
    },
    {
      name: "Care Guide",
      href: "/admin/content-management/care-guide",
      icon: IconColumns3,
    },
    {
      name: "About",
      href: "/admin/content-management/about",
      icon: IconReport,
    },
    {
      name: "Contact",
      href: "/admin/content-management/contact",
      icon: IconPhone,
    },
    {
      name: "FAQs",
      href: "/admin/content-management/faq",
      icon: IconClipboard,
    },

  ],
}


export function getFilteredNavigation(userRole: string) {
  return {
    ...data,
    navMain: data.navMain.filter(item => {
      if (item.requiresAdmin && userRole !== "admin") {
        return false;
      }
      return true;
    }),
  };
}