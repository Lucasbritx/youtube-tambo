"use client";

import { MyDashboard } from "@/components/MyDashboard";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { useAnonymousUserKey } from "@/lib/use-anonymous-user-key";
import { TamboProvider } from "@tambo-ai/react";

/**
 * Home page component that renders the YouTube Dashboard with Tambo AI integration.
 *
 * @remarks
 * This page integrates the YouTube-style dashboard with Tambo AI assistant,
 * allowing users to discover trending tech videos and interact with an AI assistant
 * that can provide analytics and insights.
 */
export default function Home() {
  // Load MCP server configurations
  const mcpServers = useMcpServers();
  const userKey = useAnonymousUserKey();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      userKey={userKey}
    >
      <MyDashboard showChat={true} initialTab="discover" />
    </TamboProvider>
  );
}
