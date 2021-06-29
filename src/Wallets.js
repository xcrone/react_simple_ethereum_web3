import { createContext } from 'react'
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from "@walletconnect/web3-provider";
import axios from 'axios'
import timeAgo from 'time-ago'

let web3Modal
let provider;
const apiLink = "https://api.bscscan.com/api"
const apiKey = "MAMMQS6CJJ43FF8CR9WX54P1EUAUA56J2D"
window.web3 = new Web3(window.ethereum);
export let account = null;
export let chainId = null;
export let status = false;
export let balance = 0;
const WalletsContext = createContext({});

function init() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          1: "https://mainnet.infura.io/v3/847d1860447a4c31a68d79c87b461bd1",
          3: "https://ropsten.infura.io/v3/847d1860447a4c31a68d79c87b461bd1",
          56: "https://bsc-dataseed.binance.org/",
          97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        },
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
      account = accounts[0];
      chainId = await web3.eth.getChainId();
      status = true;
      balance = await web3.eth.getBalance(accounts[0]);
      return {account, chainId, status, balance};
    }else {
      provider = null;
      account = null;
      chainId = null;
      status = false;
      balance = 0;
      return {account, chainId, status, balance};
    }
  } catch (error) {
    provider = null;
    account = null;
    chainId = null;
    status = false;
    balance = 0;
    return {account, chainId, status, balance};
  }
}

async function refreshAccountData() {
  try {
    return await fetchAccountData(provider);
  } catch (error) {
    account = null;
    chainId = null;
    status = false;
    balance = 0;
    return {account, chainId, status, balance};
  }
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

  return await refreshAccountData();
}

async function onDisconnect() {
  try {
    if(provider && provider._events.close[0]) { await provider._events.close[0](); }
    if(provider && provider.connected) { await provider._events.disconnect(); }
    await web3Modal.clearCachedProvider();
    provider = null;
    account = null;
    chainId = null;
    status = false;
    balance = 0;
    return {account, chainId, status, balance};
  } catch (error) {
    account = null;
    chainId = null;
    status = false;
    balance = 0;
    return {account, chainId, status, balance};
  }
}

function shortAddress(_address, _option = {uppercase: false, middle: false}) {
  try {
    _address = _address.toString();
    let showAddress;
    if(_option.middle === true) {
        showAddress = _address.substring(0, 6)
        showAddress = showAddress + "..."
        showAddress = showAddress + _address.substring((_address.length - 4), _address.length)
    }else {
        showAddress = _address.substring(0, 22)
        showAddress = showAddress + "..."
    }
    if(_option.uppercase === true) {
        showAddress = showAddress.toUpperCase()
    }
    return showAddress;
  } catch (error) {
    return _address;
  }
}

function epochToTimeAgo(_epoch) {
  var epochedDate = new Date( _epoch *1000);
  return timeAgo.ago(epochedDate);
}

function weiToEther(_amount = 0) {
  try {
    return window.web3.utils.fromWei(_amount, 'ether');
  } catch (error) {
    return 0;
  }
}

function weiToGwei(_amount = 0) {
  try {
    return window.web3.utils.fromWei(_amount, 'Gwei');
  } catch (error) {
    return 0;
  }
}

async function transferETH(_from, _to, _amount = 0) {
  try {
    const web3 = new Web3(provider);
    // should make validate _amount is number
    _amount = web3.utils.toWei(_amount, 'ether');
    web3.eth.sendTransaction({
        from: _from,
        to: _to,
        value: _amount,
    }).catch(() => console.log("cancel transfer"));
  } catch (error) {
    console.log("something wrong");
  }
}

async function txListing(_address = null, _paginate = null) {
  try {
      let link;
      if(_paginate === null) {
          link = apiLink+"?module=account&action=txlist&address="+_address+"&startblock=1&endblock=99999999&sort=desc&apikey="+apiKey
      } else {
          link = apiLink+"?module=account&action=txlist&address="+_address+"&startblock=1&endblock=99999999&page="+_paginate.page+"&offset="+_paginate.offset+"&sort=desc&apikey="+apiKey
      }
      let res = await axios.get(link);
      if(res.data.status === "1" && res.data.message === "OK") {
          return res.data.result;
      } else {
          return [];
      }
  } catch (error) {
      return [];
  }
}

async function getContract(_address = null, _abi = null) {
  let _contract;
  try {
      if (_address !== null && _address !== "") {
          if (_abi === null) {
              let res = await axios.get(apiLink + "?module=contract&action=getabi&address=" + _address + "&apikey=" + apiKey)
              if (res.data.message === "OK") {
                  _abi = res.data.result;
              }
          }
          if(typeof(_abi) === typeof("")) {
              _abi = JSON.parse(_abi);
          }
          _contract = new window.web3.eth.Contract(_abi, _address);
          return _contract;
      }else {
          return null
      }
  } catch (error) {
      return null;
  }
}

async function tokenInfo({
  contract = null, 
  address = null, 
  abi = null
}) {
  try {
      if (!contract) {
        contract = await getContract(address, abi);
      }
      // This method of getting token information can be changed if using API PRO in Etherscan or Bscscan
      let _name = await contract.methods.name().call((res) => res);
      let _symbol = await contract.methods.symbol().call((res) => res);
      let _decimals = await contract.methods.decimals().call((res) => res);
      let _totalSupply = await contract.methods.totalSupply().call((res) => res);
      return {
          name: _name,
          symbol: _symbol,
          decimals: _decimals,
          totalSupply: _totalSupply,
      };   
  } catch (error) {
      return null;
  }
}

async function tokenTransfer({
  contract = null, 
  address = null, 
  abi = null, 
  from = null, 
  to = null, 
  amount = null
}) {
  try {
      if (!contract) {
        contract = await getContract(address, abi); 
      }
      amount = window.web3.utils.toWei(amount, 'ether');
      await contract.methods.transfer(to, amount).send({ from: from });
  } catch (error) {
      alert("Something wrong: ", error);
  }
}

window.addEventListener('load', async () => init() );

export default {
  WalletsContext, 
  account, 
  chainId,
  status,
  balance,
  onConnect, 
  onDisconnect,
  shortAddress,
  epochToTimeAgo,
  weiToEther,
  weiToGwei,
  transferETH,
  txListing,
  getContract,
  tokenInfo,
  tokenTransfer,
}