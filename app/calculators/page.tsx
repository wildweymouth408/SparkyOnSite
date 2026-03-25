import { ToolsTab } from '@/components/tools-tab';

interface Props {
  searchParams: Promise<{ tool?: string }>;
}

export default async function CalculatorsPage({ searchParams }: Props) {
  const { tool } = await searchParams;
  return <ToolsTab initialToolId={tool ?? null} />;
}
