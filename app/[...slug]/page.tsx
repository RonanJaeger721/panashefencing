import PanasheSite from "@/components/panashe-site";

export default async function RoutedPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <PanasheSite initialPath={`/${slug.join("/")}`} />;
}
