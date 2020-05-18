const EC = require( 'elliptic' ).ec;
class KeyGenerator {
    generateKeys() {
        this.keyPair = KeyGenerator.ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic( 'hex' );
        this.privateKey = this.keyPair.getPrivate( 'hex' );
    }
}
KeyGenerator.ec = new EC( 'secp256k1' );

module.exports = KeyGenerator;