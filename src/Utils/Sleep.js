function sleep( miliseconds ) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

module.exports = sleep;