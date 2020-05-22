const runFullNodeDemo = require( './fullnode-demo' );
const runPsvDemo = require( './psv-demo' );
const PeersData = require( '../src/Network/PeersData' );

const myPeerIndex = Number( process.argv[ 2 ] );
const otherPeersIndex = [ 0, 1, 2 ].filter( num => num !== myPeerIndex );
const transactionsConfig = [ {
        toPeerIndex: otherPeersIndex[ 0 ],
        amount: 50
    },
    {
        toPeerIndex: otherPeersIndex[ 1 ],
        amount: 50
    },
    {
        toPeerIndex: otherPeersIndex[ 0 ],
        amount: 100
    },
    {
        toPeerIndex: otherPeersIndex[ 1 ],
        amount: 150
    },
    {
        toPeerIndex: otherPeersIndex[ 0 ],
        amount: 200
    },
    {
        toPeerIndex: otherPeersIndex[ 1 ],
        amount: 250
    },
];
const ports = PeersData.data.map( data => data.port );
const myPort = ports[ myPeerIndex ];
const otherPorts = [ ports[ otherPeersIndex[ 0 ] ], ports[ otherPeersIndex[ 1 ] ] ];
if ( PeersData.data[ myPeerIndex ].type === PeersData.Types.FullNode ) {
    runFullNodeDemo( myPort, otherPorts , transactionsConfig);
} else {
    runPsvDemo( myPort, otherPorts, transactionsConfig );
}