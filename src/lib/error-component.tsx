import type { ErrorComponentProps } from "@tanstack/react-router";

const FALLBACK_MESSAGE = "Щось пішло не так. Спробуйте оновити сторінку.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="error-screen">
      <h1 className="h-display">Збій</h1>
      <p className="lede">{errorMessage(error)}</p>
    </main>
  );
}
