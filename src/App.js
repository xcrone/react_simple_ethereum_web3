import Navbar from './component/Navbar'
import SendETH from './component/SendETH'
import SendToken from './component/SendToken'
import TxLists from './component/TxLists'

function App() {
    return ( 
        <>
            <Navbar title="Web3" />
            <div className="container pt-5">
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
        </>
    );
}

export default App;