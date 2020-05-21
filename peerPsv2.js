const createP2PNetwork = require( './src/Network/P2PNetwork' );
// const Transaction = require( './src/Transaction' );
const WalletsData = require( './src/Network/PeersData' );
const PsvWallet = require( "./src/Wallets/PsvWallet" );
const PeersData = require( './src/Network/PeersData' );

const wallet = new PsvWallet();
const ports = PeersData.data.map( data => data.port );
createP2PNetwork( ports[ 2 ], ports.slice( 0, 2 ), wallet ).then( () => {
    // const transaction1 = wallet.addNewTransaction( PeersData.data[ 0 ].address, 50 );
    // const transaction2 = wallet.addNewTransaction( PeersData.data[ 1 ].address, 50 );

    // const transaction3 = wallet.addNewTransaction( PeersData.data[ 0 ].address, 100 );
    // const transaction4 = wallet.addNewTransaction( PeersData.data[ 1 ].address, 150 );

    // const transaction5 = wallet.addNewTransaction( PeersData.data[ 0 ].address, 200 );
    // const transaction6 = wallet.addNewTransaction( PeersData.data[ 1 ].address, 250 );
} );