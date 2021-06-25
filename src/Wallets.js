import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from "@walletconnect/web3-provider";

let web3Modal
let provider;
let data = {
  account: null,
  chainId: null,
  status: false,
};
let btnConnect = "#btn-connect";
let btnDisconnect = "#btn-disconnect";

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
      data = {
        account: await web3.eth.getAccounts()[0],
        chainId: await web3.eth.getChainId(),
        status: true,
      };
      document.querySelector(btnConnect).style.display = "none";
      document.querySelector(btnDisconnect).style.display = "block";
    }else {
      provider = null;
      data = {
        account: null,
        chainId: null,
        status: false,
      };
      document.querySelector(btnConnect).style.display = "block";
      document.querySelector(btnDisconnect).style.display = "none";
    }
  } catch (error) {
    provider = null;
    data = {
      account: null,
      chainId: null,
      status: false,
    };
    document.querySelector(btnConnect).style.display = "block";
    document.querySelector(btnDisconnect).style.display = "none";
  }
}

async function refreshAccountData() {
  await fetchAccountData(provider);
}

async function onConnect() {
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

  await refreshAccountData();
}

async function onDisconnect() {
  if(provider && provider._events.close[0]) { await provider._events.close[0](); }
  if(provider && provider.connected) { await provider._events.disconnect(); }
  await web3Modal.clearCachedProvider();
  provider = null;
  data = {
    account: null,
    chainId: null,
    status: false,
  };
  document.querySelector(btnConnect).style.display = "block";
  document.querySelector(btnDisconnect).style.display = "none";
}

window.addEventListener('load', async () => {
  init();
  document.querySelector(btnConnect).addEventListener("click", onConnect);
  document.querySelector(btnDisconnect).addEventListener("click", onDisconnect);
});
