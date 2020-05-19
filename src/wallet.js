const KeyGenerator = require( './KeyGenerator' );
const Transaction = require( './Transaction' );
class Wallet {
    constructor() {
        this.keyGen = new KeyGenerator();
        this.keyGen.generateKeys();
        this.address = this.keyGen.publicKey;
        this.socketsOfPeers = new Map();
    }

    createTransaction( toAddress, amount ) {
        const transaction = new Transaction( this.address, toAddress, amount );
        transaction.signTransaction( this.keyGen.keyPair );
    }

    addSocketForPeer( socket, peerPort ) {
        this.socketsOfPeers.set( peerPort, socket );
    }
}

module.exports = Wallet;