const config = require("./Config");
class BlockHeader {
    constructor( timestamp, merkleRoot, previousHash) {
        this.timestamp = timestamp;
        this.merkleRoot = merkleRoot;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();   
    }

    calculateHash() {
        return config.hashFunction( this.previousHash + this.timestamp + this.merkleRoot + this.nonce );
    }
}

module.exports = BlockHeader;