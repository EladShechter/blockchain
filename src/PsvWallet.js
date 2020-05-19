const Wallet = require( "./Wallet" );
const LightWeightBlockchain = require( "./LightWeightBlockchain" );

class PsvWallet extends Wallet{
    constructor() {
        super();
        this.blockchain = new LightWeightBlockchain();
    }

}

module.exports = PsvWallet;