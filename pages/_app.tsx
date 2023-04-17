import type { AppProps } from "next/app";
import { ThirdwebProvider, paperWallet } from "@thirdweb-dev/react";
import "../styles/globals.css";

const activeChain = "mumbai";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedWallets={[
        paperWallet({
          clientId: "a70c4312-02d4-4de1-8979-9e6108ae8273",
        }),
      ]}
      sdkOptions={{
        gasless: {
          openzeppelin: {
            relayerUrl:
              "https://api.defender.openzeppelin.com/autotasks/8ab1e1c2-e31b-4c3e-9018-d32b6472e146/runs/webhook/50fa10c3-04cc-4b7d-a92e-9208496bb323/BA3XnELUkSqhDhRZ7nMSt2",
          },
        },
      }}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
