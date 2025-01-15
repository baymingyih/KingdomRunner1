export function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
      <p className="font-medium">Failed to load progress</p>
      <p className="text-sm mt-1">{error.message}</p>
    </div>
  );
}