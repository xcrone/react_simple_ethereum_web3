import { useState } from 'react'
import Navbar from './component/Navbar'
import Info from './component/Info'
import SendETH from './component/SendETH'
import SendToken from './component/SendToken'
import TxLists from './component/TxLists'
import Wallets from './Wallets'

function App() {
    let [account, setAccount] = useState(null);
    let [status, setStatus] = useState(null);
    let [chainId, setChainId] = useState(null);
    let [balance, setBalance] = useState(null);
    let data = {
        account, status, chainId, balance, setAccount, setStatus, setChainId, setBalance
    }
    return ( 
        <Wallets.WalletsContext.Provider value={data}>
            <Navbar title="Web3" />
            <div className="container pt-5">
                <div className="row mb-5">
                    <div className="col-12">
                        <Info />
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-6">
                        <SendETH />
                    </div>
                    <div className="col-6">
                        <SendToken />
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-12">
                        <TxLists />
                    </div>
                </div>
            </div>
        </Wallets.WalletsContext.Provider>
    );
}

export default App;