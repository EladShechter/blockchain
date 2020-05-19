const createP2PNetwork = require( './src/P2PNetwork' );
// const Transaction = require( './src/Transaction' );
const PeersData = require( './src/PeersData' );
const FullNodeWallet = require( "./src/FullNodeWallet" );

// const key = new Keygenerator();
// key.generateKeys();
// let micaCoin = new Blockchain();
// console.log( 'Mining......' );

const wallet = new FullNodeWallet();

const ports = PeersData.data.map(data => data.port);
createP2PNetwork(ports[0], ports.slice(1), wallet).then(() => {
 
});

// const transaction = new Transaction( key.publicKey, 'address2', 100 );
// transaction.signTransaction( key.keyPair );
// micaCoin.addPendTransaction( transaction );


// console.log( '-------------------' )

// micaCoin.minePendingTransactions( 'mica' )

// console.log( '\n balance of  mica is', micaCoin.getBalanceOfAddress( 'mica' ) )





//console.log(JSON.stringify(micaCoin, null, 4));