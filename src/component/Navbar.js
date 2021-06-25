import ConnectButton from './ConnectButton'
import ConnectButton2 from './ConnectButton2'

const Navbar = ({
    title
}) => {
    return ( 
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">{title}</a>
                {/* <ConnectButton />
                <ConnectButton2 /> */}

                <button className="btn btn-primary" id="btn-connect">
                    Connect wallet
                </button>
                <button className="btn btn-primary" id="btn-disconnect">
                    Disconnect wallet
                </button>
            </div>
        </nav>
    )
}

// set default value
Navbar.defaultProps = {
    title: 'Test',
}

export default Navbar