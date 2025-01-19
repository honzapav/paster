import { getPreferenceValues, LocalStorage, showHUD, Icon, List, Action, ActionPanel } from "@raycast/api";
import { AI_PROVIDERS } from "./constants";
import React from "react";

interface Preferences {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  groqApiKey?: string;
  geminiApiKey?: string;
  localModelEndpoint?: string;
  localModelName?: string;
  preferredAiProvider: "openai" | "anthropic" | "groq" | "gemini" | "local";
}

type Provider = typeof AI_PROVIDERS[number];

export default function Command(): JSX.Element {
  const preferences = getPreferenceValues<Preferences>();
  const [currentProvider, setCurrentProvider] = React.useState<string>("openai");

  React.useEffect(() => {
    LocalStorage.getItem<string>("preferredAiProvider").then((value) => {
      if (value) setCurrentProvider(value);
    });
  }, []);

  const handleProviderSelect = async (provider: Provider) => {
    await LocalStorage.setItem("preferredAiProvider", provider.id);
    setCurrentProvider(provider.id);
    await showHUD(`Switched to ${provider.name}`);
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
        icon: Icon[provider.icon as keyof typeof Icon],
        title: provider.name,
        accessories: [
          {
            icon: currentProvider === provider.id ? Icon.CheckCircle : undefined,
            tooltip: currentProvider === provider.id ? "Currently selected" : undefined
          },
          { 
            icon: provider.id === "local" 
              ? (!!preferences.localModelEndpoint ? Icon.Key : Icon.ExclamationMark)
              : (!!preferences[`${provider.id}ApiKey` as keyof Preferences] ? Icon.Key : Icon.ExclamationMark),
            tooltip: provider.id === "local"
              ? (!!preferences.localModelEndpoint ? "Endpoint configured" : "Endpoint missing")
              : (!!preferences[`${provider.id}ApiKey` as keyof Preferences] ? "API Key configured" : "API Key missing")
          }
        ],
        actions: React.createElement(
          ActionPanel,
          null,
          provider.id === "local" 
            ? (preferences.localModelEndpoint
              ? React.createElement(Action, {
                  title: "Select Provider",
                  onAction: () => handleProviderSelect(provider),
                  icon: Icon.Switch
                })
              : React.createElement(Action, {
                  title: "Configure Endpoint First",
                  onAction: () => showHUD("Please configure the local model endpoint in preferences"),
                  icon: Icon.Gear
                }))
            : (preferences[`${provider.id}ApiKey` as keyof Preferences]
              ? React.createElement(Action, {
                  title: "Select Provider",
                  onAction: () => handleProviderSelect(provider),
                  icon: Icon.Switch
                })
              : React.createElement(Action, {
                  title: "Configure API Key First",
                  onAction: () => showHUD("Please configure the API key in preferences"),
                  icon: Icon.Gear
                }))
        )
      })
    )
  );
} 