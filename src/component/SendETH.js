import { useContext } from "react"
import Wallets from "../Wallets"

const SendETH = () => {
    const {data} = useContext(Wallets.WalletsContext);
    const _amount = document.getElementById('input_send_eth_amount');
    const _to = document.getElementById('input_send_eth_to');
    const transfer = async () => {
        Wallets.TransferETH(data.account, _to.value, _amount.value).then(() => {
            _amount.value = ""
            _to.value = ""
        });
    }

    let button;
    if (data.status) {
        button = <button className="btn btn-primary" onClick={transfer}>SEND</button>
    }else {
        button = <button className="btn btn-primary" disabled>SEND</button>
    }
    
    return (
        <div className="card">
            <div className="card-header">Send ETH</div>
            <div className="card-body">
                Amount:
                <input id="input_send_eth_amount" className="form-control" type="text" placeholder="ETH" />
                <br />
                To:
                <input id="input_send_eth_to" className="form-control" type="text" placeholder="Account Address" />
            </div>
            <div className="card-footer">
                {button}
            </div>
        </div>
    )
}

export default SendETH
