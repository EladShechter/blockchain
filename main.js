const Blockchain = require( './src/Blockchain' );
const Block = require( './src/Block' );
const Transaction = require( './src/Transaction' );
const Keygenerator = require( './src/Keygenerator' );

const key = new Keygenerator();
key.generateKeys();
let micaCoin = new Blockchain();
console.log( 'Mining......' );
const transaction = new Transaction( key.publicKey, 'address2', 100 );
transaction.signTransaction( key.keyPair );
micaCoin.addPendTransaction( transaction )


console.log( '-------------------' )

micaCoin.minePendingTransactions( 'mica' )

console.log( '\n balance of  mica is', micaCoin.getBalanceOfAdderss( 'mica' ) )





//console.log(JSON.stringify(micaCoin, null, 4));