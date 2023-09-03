import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { polygon, polygonMumbai } from "@wagmi/core/chains";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

export const Web3Provider = () => {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [polygon, polygonMumbai],
    [publicProvider()]
  );

  const config = createConfig({
    connectors: [
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  });
  //   return {chains, publicClient, config}
};
export default Web3Provider;
export * as Web3Context from "./context";
