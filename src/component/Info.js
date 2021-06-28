import { useContext } from "react"
import Wallets from "../Wallets"

const Info = () => {
    const {account, balance, chainId} = useContext(Wallets.WalletsContext);
    return (
        <div className="card">
            <div className="card-header">Info</div>
            <div className="card-body">
                Account: {account}
                <br />
                Balance: {Wallets.weiToEther(balance)}
                <br />
                Chain ID: {chainId}
            </div>
        </div>
    )
}

export default Info
