import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { NebulaBackground } from "@/components/shell/NebulaBackground";
import { BridgeBackground } from "@/components/bridge/BridgeBackground";
import { CockpitFrame } from "@/components/bridge/CockpitFrame";
import { CommandDock } from "@/components/shell/CommandDock";
import { NavigatorPresence } from "@/components/shell/NavigatorPresence";
import { QuickCapture } from "@/components/shell/QuickCapture";
import { StoreBoot } from "@/components/shell/StoreBoot";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel holo-border max-w-md p-8 text-center">
        <p className="hud-text">Signal Lost</p>
        <h1 className="mt-2 font-display text-6xl text-gradient-cosmic">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This coordinate isn't mapped on the BlueVerse. The bridge will guide you back.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Return to Bridge
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel holo-border max-w-md p-8 text-center">
        <p className="hud-text text-destructive">System Anomaly</p>
        <h1 className="mt-2 font-display text-2xl text-foreground">A subsystem failed to render</h1>
        <p className="mt-2 text-sm text-muted-foreground">Recalibrate and continue your mission.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Recalibrate
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background/40 px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/40"
          >
            Bridge
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BlueVerse Life OS" },
      {
        name: "description",
        content:
          "Your personal operating system — bridge, missions, finance, archive, and constitution in one cosmic command deck.",
      },
      { name: "author", content: "BlueVerse" },
      { name: "theme-color", content: "#0a1130" },
      { property: "og:title", content: "BlueVerse Life OS" },
      {
        property: "og:description",
        content:
          "Your personal operating system — bridge, missions, finance, archive, and constitution in one cosmic command deck.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "BlueVerse Life OS" },
      {
        name: "twitter:description",
        content:
          "Your personal operating system — bridge, missions, finance, archive, and constitution in one cosmic command deck.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/db53b580-c5d6-4078-b7a4-60b114e09720/id-preview-faac1f88--b1a08d76-1548-4f2b-967e-294ffa7ed92c.lovable.app-1782030257118.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/db53b580-c5d6-4078-b7a4-60b114e09720/id-preview-faac1f88--b1a08d76-1548-4f2b-967e-294ffa7ed92c.lovable.app-1782030257118.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isBridge = pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <StoreBoot />
      {isBridge ? (
        <>
          <BridgeBackground />
          <CockpitFrame />
        </>
      ) : (
        <NebulaBackground />
      )}
      <div className="relative min-h-screen">
        {!isBridge && (
          <header className="fixed top-3 right-3 z-30 hidden sm:block">
            <NavigatorPresence />
          </header>
        )}
        <main
          className={
            isBridge
              ? "relative z-10 w-full"
              : "mx-auto w-full max-w-7xl px-3 pt-4 pb-36 sm:px-6 sm:pt-6"
          }
        >
          {!isBridge && (
            <div className="sm:hidden mb-4">
              <NavigatorPresence />
            </div>
          )}
          <Outlet />
        </main>
        <QuickCapture />
        <CommandDock />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
