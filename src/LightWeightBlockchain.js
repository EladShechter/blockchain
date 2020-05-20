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
        } else {
            throw new Error( "this block is not valid" )
        }
    }

    isChainValid() {
        return this.chain.slice( 1 ).every( ( currentBlock, i ) => {
            const previousBlock = this.chain[ i ];
            return currentBlock.hash === currentBlock.calculateHash() &&
                currentBlock.previousHash === previousBlock.calculateHash();
        } );
    }

    isBlockInChain( block ) {
        const foundedBlock = this.chain.find( blk => block.hash === blk.hash );
        return foundedBlock &&
            foundedBlock.previousHash === block.previousHash &&
            foundedBlock.merkleRoot === block.merkleRoot &&
            foundedBlock.timestamp === block.timestamp;
    }
}

module.exports = LightWeightBlockchain;