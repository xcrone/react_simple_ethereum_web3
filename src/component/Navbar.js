import { useContext } from "react"
import Wallets from "../Wallets"

const Navbar = ({title}) => {
    const {data, setData} = useContext(Wallets.WalletsContext);
    const connect = async () => {
        Wallets.onConnect().then((res) => setData(res));
    }
    const disconnect = async () => {
        Wallets.onDisconnect().then((res) => setData(res));
    }
    const button = data.status ? (
        <button className="btn btn-primary" onClick={disconnect}>
            {data.account}
        </button>
    ) : (
        <button className="btn btn-primary" onClick={connect}>Connect wallet</button>
    );

    return ( 
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">{title}</a>
                {button}
            </div>
        </nav>
    )
}

// set default value
Navbar.defaultProps = {
    title: 'Test',
}

export default Navbar