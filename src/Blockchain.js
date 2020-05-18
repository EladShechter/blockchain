const Block = require( "./Block" );
const Transaction = require( "./Transaction" );
const MemPoolDal = require( "./MemPoolDal" );
const config = require( "./Config" );

class Blockchain {
    constructor() {
        this.chain = [ this._createGenesisBlock() ];
    }
    _createGenesisBlock() {
        return new Block( [], Date.now(), "0" )
    }

    getLatestBlock() {
        return this.chain[ this.chain.length - 1 ];
    }

    minePendingTransactions( miningRewardAddress ) {
        const rewradTx = new Transaction( null, miningRewardAddress, config.mineReward );
        const transactions = MemPoolDal.getFirstTransactions( config.transactionsPerBlock );
        transactions.unshift( rewradTx );
        let block = new Block( transactions, Date.now(), this.getLatestBlock().hash )

        block.mineBlock( config.proofOfWorkDifficulty );
        console.log( 'block successfully mined' )
        this.chain.push( block );
        MemPoolDal.removeTransactions( transactions );
    }

    getBalanceOfAddress( address ) {
        let balance = 0
        for ( const block of this.chain ) {
            for ( const trans of block.transactions ) {
                if ( trans.fromAddress === address ) {
                    balance -= trans.amount
                }
                if ( trans.toAddress === address ) {
                    balance += trans.amount
                }
            }
        }
        return balance
    }

    addPendTransaction( transaction ) {
        if ( !transaction.fromAddress || !transaction.toAddress ) {
            throw new Error( "transaction must include from and to address" );
        }
        if ( !transaction.isValid() ) {
            throw new Error( "transaction is not valid" );
        }
        MemPoolDal.appendToMemPool( transaction );
    }

    isChainValid() {
        for ( let i = 1; i < this.chain.length; i++ ) {
            const currentBlock = this.chain[ i ];
            const previousBlock = this.chain[ i - 1 ];

            if ( !currentBlock.hasValidTransactions() ||
                currentBlock.hash !== currentBlock.calculateHash() ||
                currentBlock.previousHash !== previousBlock.calculateHash()
            ) {
                return false;
            }

        }
        return true
    }

    getBlockAndProofOfTransaction( transaction ) {
        for ( const block of this.chain ) {
            if ( block.hasTransaction( transaction ) ) {
                let proof = block.getTransactionProofPath( transaction );
                if ( proof.length !== 0 ) {
                    return {
                        block,
                        proof
                    };
                }
            }
        }
        return false;
    }
}
module.exports = Blockchain;