const topology = require( 'fully-connected-topology' );
const PeersData = require( "./PeersData" );

function createP2PNetwork( myPort, peersPorts, wallet ) {
    const toLocalIp = port => `127.0.0.1:${port}`;
    const getPeerIps = peers => peers.map( peer => toLocalIp( peer ) );
    const extractPortFromIp = peer => Number(peer.slice( -4 ));
    const myPeerData = PeersData.getPeerDataOfPort( myPort );
    myPeerData.address = wallet.address;

    return new Promise( resolve => {
        topology( toLocalIp( myPort ), getPeerIps( peersPorts ) )
            .on( 'connection', ( socket, peerIp ) => {
                const peerPort = extractPortFromIp( peerIp );
                wallet.addSocketForPeer( socket, peerPort );
                const announceAddressMethod = "announceAddress"
                socket.write( JSON.stringify( {
                    method: announceAddressMethod,
                    data: wallet.address
                } ) );

                const setPeersAddressesListener = ( messageBuffer ) => {
                    const messageJson = JSON.parse( messageBuffer.toString() );
                    if ( messageJson.method === announceAddressMethod ) {
                        const peerData = PeersData.getPeerDataOfPort( peerPort );
                        peerData.address = messageJson.data;
                        if ( PeersData.areAllAddressesSet() ) {
                            console.log( "all peers connected and all adresses are set" );
                            socket.removeListener( "data", setPeersAddressesListener );
                            resolve();
                        }
                    }
                }
                socket.on( "data", setPeersAddressesListener );
                console.log( `${myPort} is connected to port ${peerPort}` );
            } );
    } );
}

module.exports = createP2PNetwork;