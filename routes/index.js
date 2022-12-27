module.exports = (app) => {
    try {
        const productRoutes = require('../controller/products')(app);
        const administrator = require('../controller/administrator')(app);

    } catch (error) {
        console.log("error in routing--->>>>", error);
    }
}