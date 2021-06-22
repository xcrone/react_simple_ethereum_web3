import Wallet from "./Wallet"
import { useState, useEffect } from "react";

const TxLists = () => {
    let [txs, setTxs] = useState([]);
    let {account} = Wallet.Data();

    useEffect( () => {
        const getData = async () => {
            const data = await Wallet.TxListing(account, {
                page: 1,
                offset: 20
            }); 
            setTxs(data);
        }
        getData();
    }, [account]);

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
                                            {Wallet.ShortAddress(tx.hash)}
                                        </a>
                                    </td>
                                    <td>
                                        <a target="_blank" href={"https://testnet.bscscan.com/block/"+tx.blockNumber}>
                                            {tx.blockNumber}
                                        </a>
                                    </td>
                                    <td>{Wallet.EpochToTimeAgo(tx.timeStamp)}</td>
                                    <td>
                                        <a target="_blank" href={"https://testnet.bscscan.com/address/"+tx.from}>
                                            {tx.from === account ? "My Account" : Wallet.ShortAddress(tx.from)}
                                        </a>
                                    </td>
                                    <td>
                                        {tx.from === account ? "OUT" : "IN" }
                                    </td>
                                    <td>
                                        {tx.to === "" ? (
                                            <a target="_blank" href={"https://testnet.bscscan.com/address/"+tx.contractAddress}>
                                                Contract Creation
                                            </a>
                                        ) : (
                                            <a target="_blank" href={"https://testnet.bscscan.com/address/"+tx.to}>
                                                {tx.to === account ? "My Account" : Wallet.ShortAddress(tx.to)}
                                            </a>
                                        )}
                                    </td>
                                    <td>{Wallet.WeiToEther(tx.value)} BNB</td>
                                    <td>{
                                        Math.round(
                                            (
                                                (
                                                    Number(Wallet.WeiToGwei(tx.gasPrice)) 
                                                    * 
                                                    Number(Wallet.WeiToGwei(tx.gasUsed))
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
