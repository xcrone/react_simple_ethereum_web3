const Navbar = ({
    title
}) => {
    return ( 
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">{title}</a>
                <button className="btn btn-primary" id="btn-connect">
                    Connect wallet
                </button>
                <button className="btn btn-primary" id="btn-disconnect" style={{display: "none"}}>
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