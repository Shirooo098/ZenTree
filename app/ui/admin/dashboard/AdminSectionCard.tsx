"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardStats } from "@/app/lib/query/admin/dashboard/stats-data";
import { StatsSectionCardsSkeleton } from "@/components/ui/skeleton/skeleton";

interface AdminSectionCardProps {
  title: string;
  value: string | number;
  trend: "up" | "down";
  trendValue: string;
  footerTitle: string;
  footerDescription: string;
}

function AdminSectionCard({
  title,
  value,
  trend,
  trendValue,
  footerTitle,
  footerDescription,
}: AdminSectionCardProps) {
  const TrendIcon = trend === "up" ? IconTrendingUp : IconTrendingDown;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{value}</CardTitle>
        <CardAction>
        <Badge variant="outline">
          <TrendIcon className="h-4 w-4" />
          {trendValue}
        </Badge>
      </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
            {footerTitle} <IconTrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">
            {footerDescription}
        </div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (error) {
    return <div>Error loading stats: {error.message}</div>;
  }
  if(isLoading) return <StatsSectionCardsSkeleton/>

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats?.cards?.map((card: AdminSectionCardProps, index: number) => (
        <AdminSectionCard key={index} {...card} />
      ))}
    </div>
  );
}