import Wallet from "./Wallet"

const ConnectButton = () => {
    const {status, account} = Wallet.Data();
    const connect = Wallet.Connect(0);

    if (status === "unavailable") return <div>MetaMask not available</div>

    if (status === "initializing") return <button className="btn btn-primary" disabled>Loading...</button>

    if (status === "notConnected") return <button className="btn btn-primary" onClick={connect}>Connect to MetaMask</button>

    if (status === "connecting") return <button className="btn btn-primary" disabled>Connecting...</button>

    if (status === "connected") return <button className="btn btn-primary">{Wallet.ShortAddress(account,{uppercase: true, middle: true})}</button>

    return null;
}

export default ConnectButton
