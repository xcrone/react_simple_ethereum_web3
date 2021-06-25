import { createContext } from 'react'
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from "@walletconnect/web3-provider";

let web3Modal
let provider;
export let data = {
  account: null,
  chainId: null,
  status: false,
};
const WalletsContext = createContext({});

function init() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: "https://bsc-dataseed.binance.org/"
        },
        network: 'binance',
        infuraId: "847d1860447a4c31a68d79c87b461bd1",
      },
    },
  };

  web3Modal = new Web3Modal({
    network: "binance",
    cacheProvider: true,
    providerOptions,
    disableInjectedProvider: false,
  });
}

async function fetchAccountData() {
  try {
    if(provider) {
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      data = {
        account: accounts[0],
        chainId: await web3.eth.getChainId(),
        status: true,
      };
      return data;
    }else {
      provider = null;
      data = {
        account: null,
        chainId: null,
        status: false,
      };
      return data;
    }
  } catch (error) {
    provider = null;
    data = {
      account: null,
      chainId: null,
      status: false,
    };
    return data;
  }
}

async function refreshAccountData() {
  return await fetchAccountData(provider);
}

const onConnect = async () => {
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  return await refreshAccountData();
}

const onDisconnect = async () => {
  if(provider && provider._events.close[0]) { await provider._events.close[0](); }
  if(provider && provider.connected) { await provider._events.disconnect(); }
  await web3Modal.clearCachedProvider();
  provider = null;
  data = {
    account: null,
    chainId: null,
    status: false,
  };
  return data;
}

window.addEventListener('load', async () => init() );

export default {WalletsContext, data, onConnect, onDisconnect}