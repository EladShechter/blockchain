const config = require( "./Config" );
const Keygenerator = require( "./Keygenerator" );

class Transaction {
    constructor( fromAddress, toAddress, amount ) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }

    calculateHash() {
        return config.hashFunction( this.fromAddress + this.toAddress + this.amount);
    }

    signTransaction(keyPair) {
        if (keyPair.getPublic("hex") !== this.fromAddress) {
            throw new Error("you can't sign transaction that is not yours");
        }
        const transactionHash = this.calculateHash();
        const sig = keyPair.sign(transactionHash, "base64");
        this.signature = sig.toDER("hex");
    }

    isValid() {
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0) {
           throw new Error( "no signature in this transaction" );
        }

        const publicKey = Keygenerator.ec.keyFromPublic( this.fromAddress, "hex" );
        return publicKey.verify(this.calculateHash(), this.signature);
    }

    toJSON() {
        return {
            fromAddress: this.fromAddress,
            toAddress: this.toAddress,
            amount: this.amount,
            signature: this.signature
        }
    }
    static fromJSON(txJson){
        const transaction = new Transaction(txJson.fromAddress, txJson.toAddress, txJson.amount);
        transaction.signature = txJson.signature;
        return transaction;
    }
}
module.exports = Transaction;