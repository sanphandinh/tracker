import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tracker/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tracker/new"!</div>
}
