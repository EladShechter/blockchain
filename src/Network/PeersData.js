class PeersData {
    static getPeerDataOfPort( port ) {
        return PeersData.data.find( item => item.port === port );
    }

    static getPeerDataOfAddress( address ) {
        return PeersData.data.find( item => item.address === address );
    }

    static areAllAddressesSet() {
        return PeersData.data.every( data => !!data.address );
    }

    static getFullNodePeerData() {
        return PeersData.data.find( item => item.type === PeersData.Types.FullNode );
    }
}
PeersData.Types = {
    FullNode: "FullNode",
    PSV: "PSV"
}
PeersData.data = [ {
        port: 4001,
        address: null,
        type: PeersData.Types.FullNode
    },
    {
        port: 4002,
        address: null,
        type: PeersData.Types.PSV
    },
    {
        port: 4003,
        address: null,
        type: PeersData.Types.PSV
    }
];


module.exports = PeersData;