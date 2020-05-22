class MerkleTree {
    constructor( leaves, hashFn ) {
        this.hashFn = hashFn;
        this.createTree( leaves );
    }

    get root() {
        return this.levels[ this.levels.length - 1 ][ 0 ];
    }

    createTree( nodes ) {
        this.levels = [ nodes.slice() ];
        let levelsIndex = 0;
        while ( this.levels[ levelsIndex ].length > 1 ) {
            const currentLevel = this.levels[ levelsIndex ];

            this.levels.push( [] );
            levelsIndex++;
            const nextLevel = this.levels[ levelsIndex ];
            for ( let index = 0; index < currentLevel.length; index += 2 ) {
                const firstNode = currentLevel[ index ];
                let secondNode;
                if ( index + 1 < currentLevel.length ) {
                    secondNode = currentLevel[ index + 1 ];
                } else {
                    secondNode = firstNode;
                    currentLevel.push( secondNode );
                }

                nextLevel.push( this.hashFn( firstNode + secondNode ) );
            }
        }
    }

    getProofPath( node ) {
        const proof = [];
        let nodeIndex = this.levels[ 0 ].indexOf( node );
        if ( nodeIndex !== -1 ) {
            for ( const level of this.levels.slice( 0, -1 ) ) {
                const isOdd = Boolean( nodeIndex % 2 );
                const siblingIndex = isOdd ? nodeIndex - 1 : nodeIndex + 1;
                proof.push( {
                    isRight: !isOdd,
                    data: level[ siblingIndex ]
                } );
                nodeIndex = parseInt( nodeIndex / 2 );
            }
        }

        return proof;
    }

    static verify( proof, leaf, root, hashFn ) {
        const calculatedRoot = proof.reduce(
            ( previousHash, currentProofItem ) => {
                const toBeHashed = currentProofItem.isRight ?
                    previousHash + currentProofItem.data :
                    currentProofItem.data + previousHash;
                return hashFn( toBeHashed )
            }, leaf );

        return calculatedRoot === root;
    }
}

module.exports = MerkleTree;