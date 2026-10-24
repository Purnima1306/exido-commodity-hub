import { notFound } from "next/navigation";
import { isProfessionId } from "@/lib/professions";
import DashboardContent from "@/components/dashboard/DashboardContent";

type PageProps = {
  params: Promise<{ profession: string }>;
};

export default async function DashboardPage({ params }: PageProps) {
  const { profession } = await params;

  if (!isProfessionId(profession)) {
    notFound();
  }

  return <DashboardContent profession={profession} />;
}