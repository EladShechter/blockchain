const KeyGenerator = require( '../Utils/KeyGenerator' );
const Transaction = require( '../Transaction' );

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
        this._listenForRequestsAndBroadcasts( socket, peerPort );
    }

    _listenForRequestsAndBroadcasts( socket, peerPort ) {
        this._listenForSocket( socket, ( message ) => {
            if ( ( message.type === "request" || message.type === "broadcast" ) &&
                this[ message.method ] ) {

                console.log( `${peerPort} ${ message.type} ${ message.method} method` );
                this[ message.method ]( message.data, message.address );
            }
        } )
    }

    _listenForSocket( socket, fn ) {
        socket.on( "data", ( messageBuffer ) => {
            const messageJson = JSON.parse( messageBuffer.toString() );
            fn( messageJson );
        } );
    }

    _sendToSocket( socket, method, data, type ) {
        socket.write( JSON.stringify( {
            type,
            method,
            data: data,
            address: this.address
        } ) );
    }
}

module.exports = Wallet;