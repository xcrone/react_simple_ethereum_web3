import { useState, useContext } from "react"
import Wallets from "../Wallets"

const SendToken = () => {
    const {data} = useContext(Wallets.WalletsContext);
    let [contract, setContract] = useState(null);
    let [tokenInfo, setTokenInfo] = useState({
        name: null,
        symbol: null,
    });
    const _amount = document.getElementById('input_send_token_amount');
    const _to = document.getElementById('input_send_token_to');

    const getTokenInfo = async (event) => {
        let tokenAddress = event.target.value;
        let c = await Wallets.GetContract(tokenAddress);
        setContract(c);
        Wallets.TokenInfo(c).then((_tokenInfo) => {
            if(_tokenInfo != null) {
                setTokenInfo(_tokenInfo);
            }else {
                setTokenInfo({
                    name: null,
                    symbol: null,
                });
            }
        });
    }

    const transfer = async () => {
        Wallets.TokenTransfer(contract, {
            from: data.account,
            to: _to.value,
            amount: _amount.value,
        }).then(() => {
            _to.value = "";
            _amount.value = "";
            console.log("Transfer Success");
        });
    }

    let button;
    if(tokenInfo.name !== null && data.status === "connected") {
        button = (<button className="btn btn-primary" onClick={transfer}>SEND</button>);
    }else {
        button = (<button className="btn btn-primary" disabled>SEND</button>);
    }

    return (
        <div className="card">
            <div className="card-header">Send Token</div>
            <div className="card-body">
                Token Address:
                <input onKeyUp={getTokenInfo.bind(this)} className="form-control" type="text" placeholder="Address" />
                <hr />
                Name: {tokenInfo.name}<br />
                Symbol: {tokenInfo.symbol}<br />
                <hr />
                Amount:
                <input id="input_send_token_amount" className="form-control" type="text" placeholder="Token" />
                <br />
                To:
                <input id="input_send_token_to" className="form-control" type="text" placeholder="Account Address" />
            </div>
            <div className="card-footer">
                {button}
            </div>
        </div>
    )
}

export default SendToken
