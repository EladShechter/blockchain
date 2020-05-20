const createP2PNetwork = require( './src/P2PNetwork' );
// const Transaction = require( './src/Transaction' );
const PsvWallet = require( "./src/PsvWallet" );
const PeersData = require( './src/PeersData' );

const wallet = new PsvWallet();
const ports = PeersData.data.map( data => data.port );
createP2PNetwork( ports[ 1 ], [ ports[ 0 ], ports[ 2 ] ], wallet ).then( () => {
    // const transaction1 = wallet.addNewTransaction( PeersData.data[ 0 ].address, 50 );
    // const transaction2 = wallet.addNewTransaction( PeersData.data[ 2 ].address, 50 );

    // const transaction3 = wallet.addNewTransaction( PeersData.data[ 0 ].address, 100 );
    // const transaction4 = wallet.addNewTransaction( PeersData.data[ 2 ].address, 150 );

    // const transaction5 = wallet.addNewTransaction( PeersData.data[ 0 ].address, 200 );
    // const transaction6 = wallet.addNewTransaction( PeersData.data[ 2 ].address, 250 );
} );