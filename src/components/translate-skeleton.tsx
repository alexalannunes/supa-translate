import { Skeleton } from "./ui/skeleton";

export function TranslateSkeleton() {
  return (
    <div className="font-sans p-8 pb-20 gap-16">
      <main className="flex flex-col gap-4 container mx-auto relative">
        <div className="flex gap-3 w-full items-center">
          <div className="w-full flex gap-2 items-center">
            <Skeleton className="w-32 h-9" />
            <Skeleton className="w-32 h-9" />
            <Skeleton className="w-32 h-9" />
            <Skeleton className="w-10 h-9" />
          </div>
          <div className="w-12">
            <Skeleton className="w-10 h-9" />
          </div>
          <div className="w-full flex gap-2 items-center">
            <Skeleton className="w-32 h-9" />
            <Skeleton className="w-32 h-9" />
            <Skeleton className="w-32 h-9" />
            <Skeleton className="w-10 h-9" />
          </div>
        </div>
        <div className="flex gap-3 w-full min-h-52">
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
        </div>
      </main>
    </div>
  );
}
