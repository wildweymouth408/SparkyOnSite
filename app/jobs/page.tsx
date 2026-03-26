import { Briefcase } from 'lucide-react';

export const metadata = {
  title: 'Jobs | Sparky',
  description: 'Track your job history and calculations',
};

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Briefcase className="w-5 h-5 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Jobs</h1>
        </div>
        <p className="text-zinc-400">
          Job history and tracking coming soon.
        </p>
      </div>
    </div>
  );
}
