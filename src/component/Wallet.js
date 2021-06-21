import {useMetaMask} from 'metamask-react';
import Web3 from 'web3'
import axios from 'axios'
import timeAgo from 'time-ago'

const apiLink = "https://api-testnet.bscscan.com/api"
const apiKey = "MAMMQS6CJJ43FF8CR9WX54P1EUAUA56J2D"
const web3 = new Web3(window.ethereum);

const Metamask = () => {
    const { connect, status, chainId, account } = useMetaMask()
    return { connect, status, chainId, account }
}

const ShortAddress = (_address, _option = {uppercase: false, middle: false}) => {
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
}

const EpochToTimeAgo = (_epoch) => {
    var epochedDate = new Date( _epoch *1000);
    return timeAgo.ago(epochedDate);
}

const WeiToEther = (_amount = 0) => {
    return web3.utils.fromWei(_amount, 'ether');
}

const WeiToGwei = (_amount = 0) => {
    return web3.utils.fromWei(_amount, 'Gwei');
}

const TransferETH = async (_from, _to, _amount) => {
    // should make validate _amount is number
    _amount = web3.utils.toWei(_amount, 'ether');
    web3.eth.sendTransaction({
        from: _from,
        to: _to,
        value: _amount,
    });
}

const TxListing = async (_address = null, _paginate = null) => {
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

const GetContract = async (_address = null, _abi = []) => {
    let _contract;
    try {
        if (_address !== null && _address !== "") {
            if (_abi === null || _abi === "" || _abi === []) {
                let res = await axios.get(apiLink + "?module=contract&action=getabi&address=" + _address + "&apikey=" + apiKey)
                if (res.data.message === "OK") {
                    _abi = res.data.result;
                }
            }
            if(typeof(_abi) === typeof("")) {
                _abi = JSON.parse(_abi);
            }
            _contract = new web3.eth.Contract(_abi, _address);
            return _contract;
        }else {
            return null
        }
    } catch (error) {
        return null;
    }
}

const TokenInfo = async (_contract = null) => {
    try {
        // This method of getting token information can be changed if using API PRO in Etherscan or Bscscan
        let _name = await _contract.methods.name().call((res) => res);
        let _symbol = await _contract.methods.symbol().call((res) => res);
        let _decimals = await _contract.methods.decimals().call((res) => res);
        let _totalSupply = await _contract.methods.totalSupply().call((res) => res);
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

const TokenTransfer = async (_contract = null, _data = {from: null, to: null, amount: null}) => {
    try {
        let _from = _data.from;
        let _to = _data.to;
        let _amount = _data.amount;
        _amount = web3.utils.toWei(_amount, 'ether');
        await _contract.methods.transfer(_to, _amount).send({
            from: _from
        });
    } catch (error) {
        alert("Something wrong: ", error);
    }
}

export default {
    Metamask,
    ShortAddress,
    EpochToTimeAgo,
    WeiToEther,
    WeiToGwei,
    TransferETH,
    TxListing,
    GetContract,
    TokenInfo,
    TokenTransfer
}
