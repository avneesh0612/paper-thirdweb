import { ConnectWallet, Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ConnectWallet theme="dark" />
        <Web3Button
          contractAddress="0x01c20F77C2E24F88ee427f74111eDa74D154586A"
          action={async (contract) => {
            try {
              const tx = await contract.erc721.claim(1);
              console.log(tx);
              alert("Claimed!");
            } catch (e) {
              console.log(e);
            }
          }}
          theme="dark"
          style={{
            marginTop: "1rem",
          }}
        >
          Claim
        </Web3Button>
      </main>
    </div>
  );
};

export default Home;
