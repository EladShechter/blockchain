const createP2PNetwork = require( '../src/Network/P2PNetwork' );
const PsvWallet = require( "../src/Wallets/PsvWallet" );
const PeersData = require( '../src/Network/PeersData' );
const sleep = require( "../src/Utils/Sleep" );

function runPeerPsvDemo( myPort, otherPorts, transactionsConfig ) {
    const wallet = new PsvWallet();

    createP2PNetwork( myPort, otherPorts, wallet ).then( async () => {
        // add transactions
        const transactions = [];
        wallet.eventEmitter.once( wallet.blockAddedEvent, async () => {
            for ( const item of transactionsConfig ) {
                const transaction = await wallet.addNewTransaction( PeersData.data[ item.toPeerIndex ].address, item.amount );
                transactions.push( transaction );
            }
        } );

        await sleep( 5000 );

        // verify transactions
        for ( let index = 0; index < transactions.length; index++ ) {
            const transaction = transactions[ index ];
            const isInChain = await wallet.checkIfMyTransactionIsInChain( transaction );
            if ( isInChain ) {
                console.log( `transaction ${index} is in chain` );
            } else {
                console.log( `transaction ${index} is not in chain` );
            }
        }

        // check balance
        const myBalance = await wallet.getMyBalance();
        console.log( `my current balance is ${myBalance}` );
    } );
}

module.exports = runPeerPsvDemo;