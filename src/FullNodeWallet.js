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
        this._broadcastToPsvWallets( "addNewBlock", this.blockchain.getLatestBlock().header );
    }

    addNewTransaction( toAdress, amount ) {
        const transaction = this.createTransaction( toAdress, amount );
        this.addTransactionToMemPool( transaction.toJSON() );
    }

    // invoked by psv wallet request or by rhis wallet
    addTransactionToMemPool( transactionJson, senderAddress ) {
        this.blockchain.addPendTransaction( Transaction.fromJSON( transactionJson ) );
        console.log( "transaction added to mempool." );

        this._responseToPsvWallet( "getBlockAndProofOfTransaction", true, senderAddress );
        this.mineBlockIfMemPoolIsFull();
    }

    mineBlockIfMemPoolIsFull() {
        console.log( "check if there are enough transactions to mine..." );
        if ( MemPoolDal.getTransactionsAmount() >= config.transactionsPerBlock ) {
            console.log( "there are enough transactions to mine. lets mine the block..." );
            this.blockchain.minePendingTransactions( this.address );
            console.log( "block mined. send to all the wallets" );
            this._broadcastToPsvWallets( "addNewBlock", this.blockchain.getLatestBlock().header );
        }
    }

    // invoked by psv wallet request
    getBlockAndProofOfTransaction( transactionJson, senderAddress ) {
        const transaction = Transaction.fromJSON( transactionJson );
        let result = this.blockchain.getBlockAndProofOfTransaction( transaction );
        if ( result ) {
            result = {
                ...result,
                transaction: transactionJson
            };
        }

        this._responseToPsvWallet( "getBlockAndProofOfTransaction", result, senderAddress );
    }

    // invoked by psv wallet request
    getBalanceOfAddress( address, senderAddress ) {
        const balance = this.blockchain.getBalanceOfAddress( address );
        this._responseToPsvWallet( "getBalanceOfAddress", balance, senderAddress );
    }

    _broadcastToPsvWallets( method, data ) {
        this.socketsOfPeers.forEach( socket =>
            this._sendToSocket( socket, method, data, "broadcast" )
        );
    }

    _responseToPsvWallet( method, data, walletAddress ) {
        if ( walletAddress ) {
            const peerPort = PeersData.getPeerDataOfAddress( walletAddress ).port;
            const peerSocket = peerPort && this.socketsOfPeers.get( peerPort );
            peerSocket && this._sendToSocket( peerSocket, method, data, "response" );
        }
    }


}

module.exports = FullNodeWallet;