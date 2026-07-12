import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/flow/destination")({
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  },
  component: () => null,
});
