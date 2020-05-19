const createP2PNetwork = require( './src/P2PNetwork' );
// const Transaction = require( './src/Transaction' );
const PsvWallet = require( "./src/PsvWallet" );
const PeersData = require( './src/PeersData' );

const wallet = new PsvWallet();
const ports = PeersData.data.map( data => data.port );
createP2PNetwork( ports[ 1 ], [ ports[ 0 ], ports[ 2 ] ], wallet ).then( () => {
    // console.log( PeersData.data );
} );