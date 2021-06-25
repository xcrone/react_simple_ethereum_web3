import { useContext } from "react"
import Wallets from "../Wallets"

const Info = () => {
    const {data} = useContext(Wallets.WalletsContext);
    console.log("Wallet: ", data);
    let account = data.account;
    let balance = data.balance;
    return (
        <div className="card">
            <div className="card-header">Info</div>
            <div className="card-body">
                Account: {account}
                <br />
                Balance: {Wallets.WeiToEther(balance)}
            </div>
        </div>
    )
}

export default Info
