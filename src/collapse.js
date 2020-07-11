const collapse = (obj, parentObj, parentKey) => {
    Object.entries(obj).forEach(([key, val]) => {        
        if (key === parentKey) parentObj[key] = Object.assign(val, parentObj[key]);
        if (typeof obj === 'object') collapse(val, obj, key);
    });
    return obj;
};

module.exports = collapse;
