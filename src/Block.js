const MerkleTree = require( "./Utils/MerkleTree" );
const config = require( "./Config/Config" );
const BlockHeader = require( "./BlockHeader" );
const {
    PartitionedBloomFilter
} = require( 'bloom-filters' );

class Block {
    constructor( transactions, timestamp, previousHash = "" ) {
        this.transactions = transactions;
        if ( !this.hasValidTransactions() ) {
            throw new Error( "transactions are not valid" );
        }

        this.merkleTree = this._buildMerkleTree();
        this.bloomFilter = this._buildBloomFilter();
        this.header = new BlockHeader( timestamp, this.merkleTree.root, previousHash );
    }

    mineBlock( difficulty ) {
        const header = this.header;
        while ( header.hash.substring( 0, difficulty ) !== Array( difficulty + 1 ).join( '0' ) ) {
            header.nonce++
            header.hash = this.header.calculateHash();
        }
        console.log( 'Block mined ' + header.hash )
    }

    hasValidTransactions() { 
        return this.transactions.every(tx => tx.isValid());
    }

    hasTransaction( transaction ) {
        transactionHash = transaction.calculateHash();
        return this.bloomFilter.has(transactionHash);
    }

    getTransactionProofPath(transaction) {
        transactionHash = transaction.calculateHash();
        return this.merkleTree.getProofPath(transactionHash);
    }

    _buildMerkleTree() {
        const hashedTransactions = this.transactions.map( tx => tx.calculateHash() );
        return new MerkleTree( hashedTransactions, config.hashFunction );
    }

    _buildBloomFilter() {
        const hashedTransactions = this.transactions.map( tx => tx.calculateHash() );
        return PartitionedBloomFilter.from( hashedTransactions, config.bloomFilterErrorRate );
    }
}

module.exports = Block;