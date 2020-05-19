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

        return transaction;
    }

    addSocketForPeer( socket, peerPort ) {
        this.socketsOfPeers.set( peerPort, socket );
        socket.on( "data", ( messageBuffer ) => {
            const messageJson = JSON.parse( messageBuffer.toString() );
            if ( this[ messageJson.method ] ) {
                console.log( `${peerPort} sent ${ messageJson.method} method` );
                this[ messageJson.method ]( messageJson.data, messageJson.address );
            }
        } );
    }

    _sendToSocket( socket, method, data ) {
        socket.write( {
            method,
            data: JSON.stringify( data ),
            address = this.address
        } );
    }
}

module.exports = Wallet;