import { getSession } from "@/../auth";

export default async function DashboardPage() {
  const session = await getSession();
  const userName = session?.user?.name || "User";

  return (
    <div className="mx-auto space-y-2 max-w-lg h-full flex py-10">
      <div className="text-neutral-600 dark:text-neutral-200 space-y-4">
        <p className="mb-4">Hey {userName},</p>
        <p className="mb-4">
          Thank you for your interest! Our beta program is currently at capacity. We&apos;ll soon
          notify you as new spots become available. We appreciate your patience and support.
        </p>
        <br />
        <p className="text-left">
          Jit
          <br />
          Founder
        </p>
      </div>
    </div>
  );
}
