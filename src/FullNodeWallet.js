const Wallet = require( "./Wallet" );
const Blockchain = require( "./Blockchain" );
const Transaction = require( "./Transaction" );
const MemPoolDal = require( "./MemPoolDal" );
const config = require( "./Config" );
const PeersData = require( "./PeersData" );

class FullNodeWallet extends Wallet {
    constructor() {
        super();
    }

    initBlockChain( addresses ) {
        this.blockchain = new Blockchain( addresses );
        this._sendToPsvWallets( "addNewBlock", this.blockchain.getLatestBlock().header );
    }

    addNewTransaction( toAdress, amount ) {
        const transaction = this.createTransaction( toAdress, amount );
        addTransactionToMemPool( transaction.toJSON() );
    }

    addTransactionToMemPool( transactionJson ) {
        this.blockchain.addPendTransaction( Transaction.fromJSON( transactionJson ) );
        console.log( "transaction added to mempool. check if there are enough transactions to mine..." );
        if ( MemPoolDal.getTransactionsAmount() >= config.transactionsPerBlock ) {
            console.log( "there are enough transactions to mine. lets mine the block..." );
            this.blockchain.minePendingTransactions( this.address );
            console.log( "block mined. send to all the wallets" );
            this._sendToPsvWallets( "addNewBlock", this.blockchain.getLatestBlock().header );
        }
    }

    // invoked by psv wallet
    getBlockAndProofOfTransaction( transactionJson, address ) {
        const transaction = Transaction.fromJSON( transactionJson );
        let result = this.blockchain.getBlockAndProofOfTransaction( transaction );
        if ( result ) {
            result = {
                ...result,
                transaction: transactionJson
            };
        }
        this._sendToPsvWallet( "responseTransactionProof", result, address );
    }

    _sendToPsvWallets( method, data ) {
        this.socketsOfPeers.forEach( socket =>
            this._sendToSocket( this.socket, method, data )
        );
    }

    _sendToPsvWallet( method, data, walletAddress ) {
        const peerPort = PeersData.getPeerDataOfAddress(walletAddress).port;
        const peerSocket = peerPort && this.socketsOfPeers.get( peerPort );
        peerSocket && this._sendToSocket( peerSocket, method, data );
    }


}

module.exports = FullNodeWallet;