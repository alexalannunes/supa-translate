import { TranslatePage } from "@/components/translate-page";
import { redirect, RedirectType } from "next/navigation";
import { use } from "react";

interface PageProps {
  searchParams: Promise<{
    fl?: string;
    tl?: string;
  }>;
}

export default function Home({ searchParams }: PageProps) {
  const query = use(searchParams);

  if (!query.fl || !query.tl) {
    redirect("/?fl=pt&tl=en", RedirectType.replace);
  }

  return <TranslatePage />;
}
