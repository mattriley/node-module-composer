module.exports = (target, opts = {}) => {

    const { delimiter = '.', maxDepth = Infinity } = opts;
    const output = {}

    const step = (object, prev, currentDepth = 1) => {
        Object.keys(object).forEach(function (key) {
            const value = object[key]
            const type = Object.prototype.toString.call(value)
            const isobject = type === '[object Object]'
            const newKey = prev ? prev + delimiter + key : key

            if (isobject && Object.keys(value).length && (currentDepth < maxDepth)) {
                return step(value, newKey, currentDepth + 1)
            }

            output[newKey] = value
        })
    }

    step(target)

    return output
}
