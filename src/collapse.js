const collapse = (obj, parentObj, parentKey) => {
    if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([key, val]) => {        
            if (key === parentKey) {
                parentObj[key] = Object.assign(val, parentObj[key]);
                delete val[key];
            }
            collapse(val, obj, key);
        });
    }
    return obj;
};

module.exports = collapse;
