const createP2PNetwork = require( './src/Network/P2PNetwork' );
// const Transaction = require( './src/Transaction' );
const PeersData = require( './src/Network/PeersData' );
const FullNodeWallet = require( "./src/Wallets/FullNodeWallet" );

// const key = new Keygenerator();
// key.generateKeys();
// let micaCoin = new Blockchain();
// console.log( 'Mining......' );

const wallet = new FullNodeWallet();

const ports = PeersData.data.map( data => data.port );

createP2PNetwork( ports[ 0 ], ports.slice( 1 ), wallet ).then( () => {
    const addresses = PeersData.data.map( data => data.address );
    wallet.initBlockChain( addresses );

    wallet.addNewTransaction( PeersData.data[ 1 ].address, 50 );
    wallet.addNewTransaction( PeersData.data[ 2 ].address, 50 );

    wallet.addNewTransaction( PeersData.data[ 1 ].address, 100 );
    wallet.addNewTransaction( PeersData.data[ 2 ].address, 150 );

    wallet.addNewTransaction( PeersData.data[ 1 ].address, 200 );
    wallet.addNewTransaction( PeersData.data[ 2 ].address, 250 );

    const balanceOfAll = addresses.reduce( ( sum, address ) => {
        return sum + wallet.getBalanceOfAddress( address );
    }, 0 );

    console.log( `total balance: ${balanceOfAll}` );


} );

// const transaction = new Transaction( key.publicKey, 'address2', 100 );
// transaction.signTransaction( key.keyPair );
// micaCoin.addPendTransaction( transaction );


// console.log( '-------------------' )

// micaCoin.minePendingTransactions( 'mica' )

// console.log( '\n balance of  mica is', micaCoin.getBalanceOfAddress( 'mica' ) )





//console.log(JSON.stringify(micaCoin, null, 4));