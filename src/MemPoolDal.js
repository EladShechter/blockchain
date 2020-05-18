const fs = require( "fs" );
const Transaction = require( './Transaction' );
const memPoolpath = './MemPool.json';

class MemPoolDal {
    static getMemPool() {
        const buffer = fs.readFileSync( memPoolpath );
        if ( buffer.toString() ) {
            const json = JSON.parse( buffer );
            return json.map( tx => Transaction.fromJSON( tx ) );
        }

        return [];
    }

    static getTransactionsAmount() {
        return this.getMemPool().length;
    }

    static getFirstTransactions( amount ) {
        return this.getMemPool().slice( 0, amount );
    }

    static removeTransactions( transactions ) {
        const allTransactions = this.getMemPool();
        const filteredTransactions = allTransactions.filter( txfromPool =>
            transactions.every( txToRemove =>
                txfromPool.signature !== txToRemove.signature ) );
        this.setMemPool( filteredTransactions );
    }

    static appendToMemPool( transaction ) {
        const transactions = this.getMemPool();
        transactions.push( transaction );
        this.setMemPool( transactions );
    }

    static setMemPool( transactions ) {
        transactions = transactions.map( tx => tx.toJSON() )
        fs.writeFileSync( memPoolpath, JSON.stringify( transactions ) );
    }
}

module.exports = MemPoolDal;