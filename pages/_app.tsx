import { ChakraProvider } from "@chakra-ui/react";
import {
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import { ThirdwebSDKProvider } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import { useCallback, useEffect, useState } from "react";
import "../styles/globals.css";

const activeChain = "mumbai";

function ThirdwebCustomProvider({ children }: { children: React.ReactNode }) {
  const [signer, setSigner] = useState<any>();
  console.log("signer", signer);

  const fetchUserStatus = useCallback(async () => {
    const paper = new PaperEmbeddedWalletSdk({
      clientId: "a70c4312-02d4-4de1-8979-9e6108ae8273",
      chain: "Mumbai",
    });

    if (!paper) {
      return;
    }

    const paperUser = await paper.getUser();
    console.log("paperUser", paperUser);

    const user =
      paperUser.status === UserStatus.LOGGED_IN_WALLET_INITIALIZED
        ? paperUser
        : undefined;

    const wallet = user?.wallet;

    const signer = await wallet?.getEthersJsSigner({
      rpcEndpoint: "https://mumbai.rpc.thirdweb.com",
    });

    setSigner(signer);
  }, []);

  useEffect(() => {
    fetchUserStatus();
  }, [fetchUserStatus]);

  return (
    <ThirdwebSDKProvider
      activeChain={activeChain}
      signer={signer as any}
      sdkOptions={{
        gasless: {
          biconomy: {
            apiId: "K_BlLY7J4.5197e8f6-cc60-416e-bc85-f825cfe23a5a", // your Biconomy API Id
            apiKey: "K_BlLY7J4.5197e8f6-cc60-416e-bc85-f825cfe23a5a", // your Biconomy API Key
          },
        },
      }}
    >
      {children}
    </ThirdwebSDKProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebCustomProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebCustomProvider>
  );
}

export default MyApp;
