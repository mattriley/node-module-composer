module.exports = ({ stores }) => ({ productId, quantity }) => {
    // Use productId and quantity to produce items and totalCost...
    stores.setCart({ items, totalCost });
};
