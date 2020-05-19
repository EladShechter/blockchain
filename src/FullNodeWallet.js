const Wallet = require( "./Wallet" );
const Blockchain = require( "./Blockchain" );

class FullNodeWallet extends Wallet {
    constructor() {
        super();

        this.blockchain = new Blockchain();
        
    }
}

module.exports = FullNodeWallet;