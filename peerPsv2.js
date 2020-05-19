const createP2PNetwork = require( './src/P2PNetwork' );
// const Transaction = require( './src/Transaction' );
const WalletsData = require( './src/PeersData' );
const PsvWallet = require( "./src/PsvWallet" );
const PeersData = require( './src/PeersData' );

const wallet = new PsvWallet();
const ports = PeersData.data.map( data => data.port );
createP2PNetwork( ports[ 2 ], ports.slice( 0, 2 ), wallet ).then( () => {
    // console.log( PeersData.data );
} );