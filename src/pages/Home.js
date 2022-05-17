import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const openseaApiBaseUrl = "<opensea-api-base-url>";
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
            
            axios.get(openseaApiBaseUrl + nftContractAddress + '/' + nftTokenId)
                .then(res => {
                  if(res.data) {
                    const ownerships = res.data.top_ownerships;

                    for (const ownership of ownerships) {
                        const ownerAddress = ownership.owner.address;
                        console.log('NFT Owner Address: ' + ownerAddress);

                        // Route to Success page on validation
                        if(ownerAddress.toUpperCase() === currentAccount.toUpperCase()) {
                            navigate('/Success', { replace: true });
                        }
                    }
                  }

                  setErrorMessage('You need this NFT.');
                }).catch(function (error) {
                    console.log('Error encountered during Opensea API call' + error);
                });
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