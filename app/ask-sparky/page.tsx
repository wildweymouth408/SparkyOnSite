import { AskSparkyTab } from '@/components/ask-sparky-tab';

export default function AskSparkyPage() {
  // 60px = sticky header height in AppLayout.
  // Using 100dvh so the chat fits the real viewport on mobile browsers without scroll.
  return (
    <div
      className="flex flex-col overflow-hidden px-4 py-4"
      style={{ height: 'calc(100dvh - 60px)' }}
    >
      <AskSparkyTab />
    </div>
  );
}
