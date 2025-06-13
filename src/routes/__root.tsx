import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { RelayEnvironmentProvider } from "react-relay";
import { Container } from "../components/layout/Container";
import relayEnvironment from "../utils/relay/environment";

export const Route = createRootRouteWithContext<{
	relayEnvironment: typeof relayEnvironment;
}>()({
	component: () => (
		<RelayEnvironmentProvider environment={relayEnvironment}>
			<div className="min-h-screen bg-zinc-950 text-zinc-100">
				<Container className="py-8 space-y-8">
					<Outlet />
				</Container>
				<TanStackRouterDevtools position="bottom-right" />
			</div>
		</RelayEnvironmentProvider>
	),
});
