const Wallet = require( "./Wallet" );
const LightWeightBlockchain = require( "../LightWeightBlockchain" );
const PeersData = require( "../Network/PeersData" );
const BlockHeader = require( "../BlockHeader" );
const MerkleTree = require( "../Utils/MerkleTree" );
const Transaction = require( "../Transaction" );
const config = require( "../Config/Config" );

class PsvWallet extends Wallet {
    constructor() {
        super();
        this.blockchain = new LightWeightBlockchain();
    }

    // invoked by full node broadcast
    addNewBlock( blockJson ) {
        const block = BlockHeader.fromJson( blockJson );
        this.blockchain.appendBlock( block );
        console.log( `block ${block.hash} appended to lightweight cahin successfully` );

        console.log( "check that all the chain is valid..." );
        if ( this.blockchain.isChainValid() ) {
            console.log( "chain is valid" );
        } else {
            console.log( "chain is not valid" );
        }
    }

    addNewTransaction( toAdress, amount ) {
        return new Promise( resolve => {
            const transaction = this.createTransaction( toAdress, amount );
            this._requestFromFullNodeWallet( "addTransactionToMemPool", transaction.toJSON() );
            this._listenForResponseFromFullNode( "addTransactionToMemPool", ( ) => {
                console.log("the transaction had been added to mempool");
                resolve( transaction );
            } );
        } );
    }

    checkIfMyTransactionIsInChain( transaction ) {
        return new Promise( resolve => {
            this._requestFromFullNodeWallet( "getBlockAndProofOfTransaction", transaction.toJSON() );
            this._listenForResponseFromFullNode( "getBlockAndProofOfTransaction", ( response ) => {
                if ( !response ) {
                    console.log( "the transaction is not in the blockchain" );
                    resolve( false );
                } else {
                    const block = response.block;
                    console.log( "check that the block exist in our chain..." );
                    if ( !this.blockchain.isBlockInChain( block ) ) {
                        console.log( "the block is not in our chain, we have got false response" );
                        resolve( false );
                    } else {
                        console.log( "the block is in our chain, lets verify that the transaction is in it..." );
                        const transactionHash = Transaction.fromJSON( response.transaction ).calculateHash();
                        const proof = resonse.proof;
                        const isTransactionVerified = MerkleTree.verify( proof, transactionHash, block.MerkleRoot, config.hashFunction );
                        if ( isTransactionVerified ) {
                            console.log( `the transaction was found in block ${block.hash} and have been verified` );
                            resolve( true );
                        } else {
                            console.log( "the transaction was not verified, we have got false response" );
                            resolve( false );
                        }
                    }
                }
            } );
        } );

    }

    getMyBalance() {
         return new Promise( resolve => {
             this._requestFromFullNodeWallet( "getBalanceOfAddress", this.address );
             this._listenForResponseFromFullNode( "getBalanceOfAddress", (response) => {
                 resolve( response );
             } );
         } );

    }

    addSocketForPeer( socket, peerPort ) {
        super.addSocketForPeer( socket, peerPort );
        const fullNodePeerData = PeersData.getFullNodePeerData();
        if ( peerPort === fullNodePeerData.port ) {
            this.fullNodeSocket = socket;
        }
    }

    _requestFromFullNodeWallet( method, data ) {
        this._sendToSocket( this.fullNodeSocket, method, data, "request" );
    }

    _listenForResponseFromFullNode( methodName, fn ) {
        this._listenForSocket( this.fullNodeSocket, ( message ) => {
            if ( message.type = "response" && message.method === methodName ) {
                fn( message.data );
            }
        } )
    }
}

module.exports = PsvWallet;