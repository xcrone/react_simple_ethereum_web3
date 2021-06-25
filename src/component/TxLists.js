import { useState, useEffect, useContext } from "react";
import Wallets from "../Wallets"

const TxLists = () => {
    const {data} = useContext(Wallets.WalletsContext);
    let [txs, setTxs] = useState([]);

    useEffect( () => {
        const getData = async () => {
            const res = await Wallets.TxListing(data.account, {
                page: 1,
                offset: 20
            }); 
            setTxs(res);
        }
        getData();
    }, [data.account]);

    return (
        <div className="card">
            <div className="card-header">
                Latest Transaction
            </div>
            <div className="card-body">
                <div className="col-12" style={{color: 'gray', fontSize: '14px'}}>
                    Latest 20 from <a href="#">all</a> transactions
                </div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Txn Hash</th>
                                <th>Block</th>
                                <th>Age</th>
                                <th>From</th>
                                <th></th>
                                <th>To</th>
                                <th>Value</th>
                                <th>[Txn Fee]</th>
                            </tr>
                        </thead>
                        <tbody>
                            {txs.map((tx) => (
                                <tr key={tx.hash}>
                                    <td>
                                        <a target="_blank" href={"https://testnet.bscscan.com/tx/"+tx.hash}>
                                            {Wallets.ShortAddress(tx.hash)}
                                        </a>
                                    </td>
                                    <td>
                                        <a target="_blank" href={"https://testnet.bscscan.com/block/"+tx.blockNumber}>
                                            {tx.blockNumber}
                                        </a>
                                    </td>
                                    <td>{Wallets.EpochToTimeAgo(tx.timeStamp)}</td>
                                    <td>
                                        <a target="_blank" href={"https://testnet.bscscan.com/address/"+tx.from}>
                                            {tx.from === data.account ? "My Account" : Wallets.ShortAddress(tx.from)}
                                        </a>
                                    </td>
                                    <td>
                                        {tx.from === data.account ? "OUT" : "IN" }
                                    </td>
                                    <td>
                                        {tx.to === "" ? (
                                            <a target="_blank" href={"https://testnet.bscscan.com/address/"+tx.contractAddress}>
                                                Contract Creation
                                            </a>
                                        ) : (
                                            <a target="_blank" href={"https://testnet.bscscan.com/address/"+tx.to}>
                                                {tx.to === data.account ? "My Account" : Wallets.ShortAddress(tx.to)}
                                            </a>
                                        )}
                                    </td>
                                    <td>{Wallets.WeiToEther(tx.value)} BNB</td>
                                    <td>{
                                        Math.round(
                                            (
                                                (
                                                    Number(Wallets.WeiToGwei(tx.gasPrice)) 
                                                    * 
                                                    Number(Wallets.WeiToGwei(tx.gasUsed))
                                                ) + Number.EPSILON
                                            ) * 1e8
                                        ) / 1e8
                                    }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TxLists
