const SHA256 = require( "crypto-js/sha256" );
const Configuration = {
    hashFunction: message => SHA256( message ).toString(),
    mineReward: 100,
    bloomFilterErrorRate: 0.04,
    proofOfWorkDifficulty: 2,
    transactionsPerBlock: 4,
    initAmountPerWallet: 1000
}

module.exports = Configuration;