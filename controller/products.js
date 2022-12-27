let { body, validationResult } = require('express-validator'),
    { InsertDoc, GetAggregationDoc, RemoveDocument, OBJECTID } = require('../model/mongodb');
module.exports = () => {
    let router = {};

    router['get_all_products'] = async (req, res) => {
        body("skip").contains();
        body("limit").contains();
        body("sort").isBoolean();
        body("sortField").contains();
        body("sortOrder").contains();
        let data = {};
        data.status = 0;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                success: false,
                response: errors.array()
            });
        }
        else {
            try {
                let { skip, limit, sort, sortField, sortOrder, search } = req.query,
                    condition = {}, sorting = {},
                    query = [];
                if (skip && skip !== undefined && String(skip).length > 0) {
                    skip = +skip
                } else {
                    skip = 0
                }
                if (limit && limit !== undefined && String(limit).length > 0) {
                    limit = +limit
                } else {
                    limit = 0
                }
                if (sort) {
                    sorting[sortField] = +sortOrder
                } else {
                    sorting = { createdAt: -1 }
                }
                if (search && search !== '') {
                    var searchs = search;
                    var orData = [
                        { "name": { $regex: searchs + '.*', $options: 'si' } },
                        { "code": { $regex: searchs + '.*', $options: 'si' } },
                    ]
                    condition["$or"] = orData;
                }

                query = [
                    { $match: condition },
                    {
                        $facet:
                        {
                            "data": [
                                { $sort: sorting },
                                { $match: { status: 1 } },
                                { $skip: skip },
                                { $limit: limit },
                            ],
                            // "filterCount": [{ $match: {} }, { $group: { _id: null, count: { $sum: 1 } } }],
                            "totalCount": [{ $group: { _id: null, count: { $sum: 1 } } }]
                        }
                    }];
                const productList = await GetAggregationDoc('products', query);
                if (productList && productList.length > 0) {
                    let list = productList[0].data ? productList[0].data : [];
                    let total = productList[0].totalCount ? productList[0].totalCount : [];
                    res.status(200).json({ status: 1, response: list, count: total })
                } else {
                    res.json({ status: 2, response: [], message: 'Products not found' })
                }
            } catch (error) {
                console.log(`error in get products ${error}`);
                res.status(500).json({ status: 0, response: 'Somthing went wrong' });
            }
        }
    }
    router['get_all_products_nolimit'] = async (req, res) => {
        body("searchValue").contains();
        // body("sort").isBoolean();
        // body("sortField").contains();
        // body("sortOrder").contains();
        let data = {};
        data.status = 0;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                success: false,
                response: errors.array()
            });
        }
        else {
            try {
                let { searchValue } = req.query,
                    conditions = {}, sorting = {},
                    query = [];
                // if (skip && skip !== undefined && String(skip).length > 0) {
                //     skip = +skip
                // } else {
                //     skip = 0
                // }
                // if (limit && limit !== undefined && String(limit).length > 0) {
                //     limit = +limit
                // } else {
                //     limit = 0
                // }
                // if (sort) {
                //     sorting[sortField] = +sortOrder
                // } else {
                //     sorting = { createdAt: -1 }
                // }

                query = [{
                    $facet:
                    {
                        "data": [
                            { $sort: { createdAt: -1 } },
                            { $match: { status: 1 } },
                            // { $skip: skip },
                            // { $limit: limit },
                            {
                                $project: {
                                    name: 1,
                                    code: 1,
                                    price: 1,
                                    availableQuantity: '$quantity',
                                    category: 1,
                                }
                            }
                        ],
                        // "filterCount": [{ $match: {} }, { $group: { _id: null, count: { $sum: 1 } } }],
                        "totalCount": [{ $group: { _id: null, count: { $sum: 1 } } }]
                    }
                }];
                const productList = await GetAggregationDoc('products', query);
                if (productList && productList.length > 0) {
                    let list = productList[0].data ? productList[0].data : [];
                    let total = productList[0].totalCount ? productList[0].totalCount : [];
                    res.status(200).json({ status: 1, response: list, count: total })
                } else {
                    res.json({ status: 2, response: [], message: 'Products not found' })
                }
            } catch (error) {
                console.log(`error in get products ${error}`);
                res.status(500).json({ status: 0, response: 'Somthing went wrong' });
            }
        }
    }

    router['add_product'] = async (req, res) => {
        body("productName").isLength({ min: 6 });
        body("productCode").contains().isLength({ min: 6 });
        body("productCategory").contains().isLength({ min: 6 });
        body("productPrice").isNumeric().isLength({ min: 6 });
        body("productQuantity").isNumeric().isLength({ min: 6 });
        let data = {};
        data.status = 0;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 0,
                success: false,
                response: errors.array()
            });
        }
        else {
            try {
                let { productName, productCode, productCategory, productPrice, productQuantity } = req.body;
                let insertData = {};
                insertData['name'] = productName;
                insertData['code'] = productCode;
                insertData['category'] = productCategory;
                insertData['price'] = productPrice;
                insertData['quantity'] = productQuantity;
                insertData['status'] = 1;
                let insertProduct = await InsertDoc('products', insertData);
                if (insertProduct && insertProduct._id) {
                    return res.json({ status: 1, response: 'product added successfully' });
                } else {
                    return res.json({ status: 0, response: 'product not added' });
                }
            }
            catch (error) {
                console.log('error in add product', error);
                return res.json({ status: 0, response: 'somthing went wrong' });
            }
        }
    }

    router['delete_products'] = async (req, res) => {
        try {
            let { id } = req.query;
            // if (!id && id === '') {
            //     return res.json({ status: 0, response: 'product not available' });
            // }
            let deleteProduct = await RemoveDocument('products', { _id: OBJECTID(id) });
            if (deleteProduct && deleteProduct.deletedCount > 0) {
                return res.json({ status: 1, response: 'product deleted successfully' });
            } else {
                return res.json({ status: 0, response: 'product not deleted' });
            }
        }
        catch (error) {
            console.log('error in delete product', error);
            return res.json({ status: 0, response: 'somthing went wrong' });
        }
    }


    return router;
}