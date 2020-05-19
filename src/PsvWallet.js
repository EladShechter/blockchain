const Wallet = require( "./Wallet" );
const LightWeightBlockchain = require( "./LightWeightBlockchain" );
const PeersData = require( "./PeersData" );
const BlockHeader = require( "./BlockHeader" );
const MerkleTree = require( "./MerkleTree" );
const Transaction = require( "./Transaction" );
const config = require( "./Config" );

class PsvWallet extends Wallet {
    constructor() {
        super();
        this.blockchain = new LightWeightBlockchain();
    }

    // invoked by full node
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


    // invoked by full node
    responseTransactionProof( response ) {
        if ( !response ) {
            console.log( "the transaction is not in the blockchain" );
        } else {
            const block = response.block;
            console.log( "check that the block exist in our chain..." );
            if ( !this.blockchain.isBlockInChain( block ) ) {
                console.log( "the block is not in our chain, we have got false response" );
            } else {
                console.log( "the block is in our chain, lets verify that the transaction is in it..." );
                const transactionHash = Transaction.fromJSON( response.transaction ).calculateHash();
                const proof = resonse.proof;
                const isTransactionVerified = MerkleTree.verify( proof, transactionHash, block.MerkleRoot, config.hashFunction );
                if ( isTransactionVerified ) {
                    console.log( `the transaction was found in block ${block.hash} and have been verified` );
                } else {
                    console.log( "the transaction was not verified, we have got false response" );
                }
            }
        }
    }

    addNewTransaction( toAdress, amount ) {
        const transaction = this.createTransaction( toAdress, amount );
        _sendToFullNodeWallet( "addTransactionToMemPool", transaction.toJSON() );
    }

    checkIfMyTransactionIsInChain( transaction ) {

    }

    getMyBalance() {

    }

    addSocketForPeer( socket, peerPort ) {
        super.addSocketForPeer( socket, peerPort );
        const fullNodePeerData = PeersData.getFullNodePeerData();
        if ( peerPort === fullNodePeerData.port ) {
            this.fullNodeSocket = socket;
        }
    }

    _sendToFullNodeWallet( method, data ) {
        this._sendToSocket( this.fullNodeSocket, method, data );
    }


}

module.exports = PsvWallet;