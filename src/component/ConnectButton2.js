import Wallet from "./Wallet"

const ConnectButton2 = () => {
    const connect = Wallet.Connect(1);
    return <button className="btn btn-primary" onClick={connect}>Connect to WalletConnect</button>
}

export default ConnectButton2
