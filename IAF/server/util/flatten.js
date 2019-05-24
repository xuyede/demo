const flatten = array => {
    return array.reduce( (baton, curVal) => {
        return baton.concat(Array.isArray(curVal) ? flatten(curVal) : [curVal])
    }, [])
};

module.exports.flatten = flatten;