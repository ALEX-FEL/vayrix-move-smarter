import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/shared/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/flow/share-request/$id", params: { id: params.id } });
  },
  component: () => null,
});
