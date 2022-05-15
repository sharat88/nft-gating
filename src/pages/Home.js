import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { hexToNumberString } from "web3-utils";

const alchemyApiBaseUrl = "<alchemy-base-url>";
const alchemyApiKey = "<alchemy-api-key>";
const nftContractAddress = "<nft-contract-address>";
const nftTokenId = "<nft-token-id>";

const Home = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const checkWalletIsConnected = async () => {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have Metamask installed!");
        return;
      } else {
        console.log("Wallet exists! We're ready to go!")
      }
  
      const accounts = await ethereum.request({ method: 'eth_accounts' });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    };
  
    const connectWalletHandler = async () => {
      const { ethereum } = window;
  
      if (!ethereum) {
        alert("Please install Metamask!");
      }
  
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Found an account! Address: ", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (err) {
        console.log(err)
      }
    };
  
    const accessNftHandler = async () => {
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          console.log("Logged in user account address: ", currentAccount);

          const web3 = createAlchemyWeb3(alchemyApiBaseUrl + alchemyApiKey);
        
          const nfts = await web3.alchemy.getNfts({
            owner: currentAccount,
            withMetadata: false,
            contractAddresses: [
              nftContractAddress
            ]
          });
  
          // Print contract address and tokenId for each NFT
          for (const nft of nfts.ownedNfts) {
            console.log("===");
            console.log("Contract address:", nft.contract.address);
            console.log("Token ID Hex:", nft.id.tokenId);
            
            const convertedTokenId = hexToNumberString(nft.id.tokenId);
            
            console.log('Token ID decimal: ' + convertedTokenId);
            
            // Fetch metadata for a particular NFT:
            console.log("fetching metadata for NFT...");
            const nftMetadata = await web3.alchemy.getNftMetadata({
              contractAddress: nft.contract.address,
              tokenId: nft.id.tokenId
            })
  
            // Print some commonly used fields:
            console.log("NFT name: ", nftMetadata.title);
            console.log("Token type: ", nftMetadata.id.tokenMetadata.tokenType);
            console.log("Token Uri: ", nftMetadata.tokenUri.gateway);
            console.log("Image url: ", nftMetadata.metadata.image);
            console.log("Time last updated: ", nftMetadata.timeLastUpdated);

            // Route to Success page on validation
            if(convertedTokenId === nftTokenId) {
              navigate('/Success', { replace: true });
            }
          }
  
          //console.log("Allow access: " + allowAccess);

          setErrorMessage('You need this NFT.');
  
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    };

    const connectWalletButton = () => {
      return (
        <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
          Connect Wallet
        </button>
      )
    };
  
    const accessNftButton = () => {
      return (
        <button onClick={accessNftHandler} className='cta-button access-nft-button'>
          Access NFT
        </button>
      )
    };
  
    // useEffect(() => {
    //   checkWalletIsConnected();
    // }, [])

    useEffect(() => {
        checkWalletIsConnected();
    }, []);
  
    return (
      <div>
        <h1>NFT Gating</h1>
        <div>
            {currentAccount ? accessNftButton() : connectWalletButton()}
            {errorMessage && (
                <p className="error"> {errorMessage} </p>
            )}
        </div>
      </div>
    )
};

export default Home;