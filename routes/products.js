module.exports = (app, auth) => {
    try {
        const productRoutes = require("../controller/products")(app);

        app.get('/product/list', productRoutes['get_all_products']);
        app.get('/all/products/list', productRoutes['get_all_products_nolimit']);
        app.post('/product/add', productRoutes['add_product']);
        app.delete('/product/delete', productRoutes['delete_products']);
    } catch (error) {
        console.log("TCL: e", e)
    }

}