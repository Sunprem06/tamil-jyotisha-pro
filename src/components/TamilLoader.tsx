export function TamilLoader({ message = 'ஏற்றுகிறது...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      <p className="text-muted-foreground font-tamil text-sm">{message}</p>
    </div>
  );
}
