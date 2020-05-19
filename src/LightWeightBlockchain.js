class LightWeightBlockchain {
    constructor() {
        this.chain = [];
    }

    getLatestBlock() {
        return this.chain[ this.chain.length - 1 ];
    }

    appendBlock( blockHeader ) {
        if ( this.chain.length === 0 ||
            this.getLatestBlock().hash === blockHeader.previousHash ) {
            this.chain.push( blockHeader );
        }
        else {
            throw new Error("this block is not valid")
        }
    }
}

module.exports = LightWeightBlockchain;