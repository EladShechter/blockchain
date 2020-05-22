const createP2PNetwork = require( '../src/Network/P2PNetwork' );
const FullNodeWallet = require( "../src/Wallets/FullNodeWallet" );
const PeersData = require( '../src/Network/PeersData' );
const sleep = require( "../src/Utils/Sleep" );

function runPeerFullNodeDemo( myPort, otherPorts, transactionsConfig ) {
    const wallet = new FullNodeWallet();

    createP2PNetwork( myPort, otherPorts, wallet ).then( async () => {
        // init block chain with expense to each wallet
        const addresses = PeersData.data.map( data => data.address );
        wallet.initBlockChain( addresses );

        // add transactions
        const transactions = [];
        for ( const item of transactionsConfig ) {
            const transaction = wallet.addNewTransaction( PeersData.data[ item.toPeerIndex ].address, item.amount );
            transactions.push( transaction );
        }

        await sleep( 5000 );

        // verify transactions
        for ( let index = 0; index < transactions.length; index++ ) {
            const transaction = transactions[ index ];
            const proof = wallet.getBlockAndProofOfTransaction( transaction );
            if ( proof ) {
                console.log( `transaction ${index} is in chain` );
            } else {
                console.log( `transaction ${index} is not in chain` );
            }
        }

        await sleep( 5000 );

        // check balance of this wallet
        const myBalance = wallet.getBalanceOfAddress(wallet.address);
        console.log( `my current balance is ${myBalance}` );

       // check balance of all wallets
         const balanceOfAll = addresses.reduce( ( sum, address ) => {
             return sum + wallet.getBalanceOfAddress( address );
         }, 0 );

         console.log( `total balance: ${balanceOfAll}` );
    } );
}

module.exports = runPeerFullNodeDemo;