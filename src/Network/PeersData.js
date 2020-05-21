class PeersData {
    static getPeerDataOfPort(port) {
        return PeersData.data.find( item => item.port === port );
    }

    static getPeerDataOfAddress( address ) {
        return PeersData.data.find( item => item.address === address );
    }

    static areAllAddressesSet() {
        return PeersData.data.every( data => !!data.address );
    }

    static getFullNodePeerData() {
        return PeersData.data.find( item => item.type === "FullNode" );
    }
}

PeersData.data = [ {
        port: 4001,
        address: null,
        type: "FullNode"
    },
    {
        port: 4002,
        address: null,
        type: "PSV"
    },
    {
        port: 4003,
        address: null,
        type: "PSV"
    }
];


module.exports = PeersData;