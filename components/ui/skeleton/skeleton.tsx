import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonReview() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-[250px] bg-gray-200" />
        <Skeleton className="h-4 w-[200px] bg-gray-200" />
      </div>
    </div>
  )
}

export function SkeletonProfile(){
   return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    </div>
  )
}
