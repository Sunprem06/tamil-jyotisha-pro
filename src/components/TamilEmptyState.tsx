export function TamilEmptyState({
  message = 'தரவு எதுவும் இல்லை',
  subMessage = 'விரைவில் சேர்க்கப்படும்',
}: {
  message?: string;
  subMessage?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
      <div className="text-5xl mb-2">🕉</div>
      <p className="text-lg font-tamil text-foreground">{message}</p>
      <p className="text-sm text-muted-foreground font-tamil">{subMessage}</p>
    </div>
  );
}
