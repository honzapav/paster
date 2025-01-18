import { getPreferenceValues, LocalStorage, showHUD, Icon, List, Action, ActionPanel } from "@raycast/api";
import { AI_PROVIDERS } from "./constants";
import React from "react";

interface Preferences {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  groqApiKey?: string;
  preferredAiProvider: "openai" | "anthropic" | "groq";
}

type Provider = typeof AI_PROVIDERS[number];

export default function Command(): JSX.Element {
  const preferences = getPreferenceValues<Preferences>();

  const handleProviderSelect = async (providerId: Provider["id"]) => {
    try {
      await LocalStorage.setItem("preferredAiProvider", providerId);
      const provider = AI_PROVIDERS.find(p => p.id === providerId);
      await showHUD(`Switched to ${provider?.name}`);
    } catch (error) {
      console.error("Failed to switch AI provider:", error);
      await showHUD("Failed to switch AI provider");
    }
  };

  return React.createElement(
    List,
    {
      navigationTitle: "Switch AI Provider",
      searchBarPlaceholder: "Search AI providers"
    },
    AI_PROVIDERS.map((provider) =>
      React.createElement(List.Item, {
        key: provider.id,
        icon: Icon[provider.icon],
        title: provider.name,
        accessories: [
          { icon: preferences.preferredAiProvider === provider.id ? Icon.CheckCircle : undefined },
          { 
            icon: !!preferences[`${provider.id}ApiKey` as keyof Preferences] ? Icon.Key : Icon.ExclamationMark,
            tooltip: !!preferences[`${provider.id}ApiKey` as keyof Preferences] ? "API Key configured" : "API Key missing"
          }
        ],
        actions: React.createElement(
          ActionPanel,
          null,
          React.createElement(Action, {
            title: "Select Provider",
            onAction: () => handleProviderSelect(provider.id),
            icon: Icon.Switch
          })
        )
      })
    )
  );
} 