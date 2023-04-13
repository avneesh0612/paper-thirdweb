import {
  GetUser,
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Login } from "../components/Login";
import styles from "../styles/Home.module.css";
import { Button } from "@chakra-ui/react";
import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useClaimNFT,
  useContract,
} from "@thirdweb-dev/react";

const Home: NextPage = () => {
  const [paper, setPaper] = useState<PaperEmbeddedWalletSdk>();
  const [userDetails, setUserDetails] = useState<GetUser>();
  const { contract: nftDrop } = useContract(
    "0x01c20F77C2E24F88ee427f74111eDa74D154586A",
    "nft-drop"
  );
  const { mutate: claimNft, isLoading, error } = useClaimNFT(nftDrop);
  const address = useAddress();

  useEffect(() => {
    const paper = new PaperEmbeddedWalletSdk({
      clientId: "a70c4312-02d4-4de1-8979-9e6108ae8273",
      chain: "Mumbai",
    });
    setPaper(paper);
  }, []);

  const fetchUserStatus = useCallback(async () => {
    if (!paper) {
      return;
    }

    const paperUser = await paper.getUser();
    console.log("paperUser", paperUser);

    setUserDetails(paperUser);
  }, [paper]);

  useEffect(() => {
    if (paper && fetchUserStatus) {
      fetchUserStatus();
    }
  }, [paper, fetchUserStatus]);

  const logout = async () => {
    const response = await paper?.auth.logout();
    console.log("logout response", response);
    await fetchUserStatus();
  };

  const callContractGasless = async () => {
    // if (!userDetails) {
    //   return;
    // }

    // const user =
    //   userDetails.status === UserStatus.LOGGED_IN_WALLET_INITIALIZED
    //     ? userDetails
    //     : undefined;

    // const params = {
    //   contractAddress: "0xb2369209b4eb1e76a43fAd914B1d29f6508c8aae",
    //   methodArgs: [user?.walletAddress ?? "", 1, 0],
    //   methodInterface:
    //     "function claimTo(address _to, uint256 _quantity, uint256 _tokenId) external",
    // } as ContractCallInputType;
    // console.log("params", params);
    // try {
    //   const result = await user?.wallet.gasless.callContract(params);
    //   console.log("transactionHash", result?.transactionHash);
    // } catch (e) {
    //   console.error(`something went wrong sending gasless transaction ${e}`);
    // }

    claimNft({
      to: address, // Use useAddress hook to get current wallet address
      quantity: 1,
    });
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {userDetails && userDetails.status === UserStatus.LOGGED_OUT && (
          <Login paper={paper} onLoginSuccess={fetchUserStatus} />
        )}

        {userDetails &&
          userDetails.status === UserStatus.LOGGED_IN_WALLET_INITIALIZED && (
            <div>
              <h1>Logged in</h1>
              <button onClick={logout}>Logout</button>
              <Button onClick={callContractGasless} colorScheme="blue">
                Call contract method (Gasless)
              </Button>
            </div>
          )}
      </main>
    </div>
  );
};

export default Home;
