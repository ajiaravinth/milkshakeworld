let { Types } = require("mongoose");
const products = require("../schema/productschema");

const db = {
    products: products
};

const InsertMultiple = (model, docs, callback) => {
	return new Promise((resolve, reject) => {
		db[model].insertMany(docs, (err, numAffected) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(numAffected);
			}
		});
	})

};
const UpdateMany = (model, criteria, doc, options) => {
	return new Promise((resolve, reject) => {
		db[model].updateMany(criteria, doc, options, (err, docs) => {
			if (err) {
				reject(err);
			} else {
				resolve(docs);
			}
		});
	})

};
const GetCount = (model, conditions) => {
	return new Promise((resolve, reject) => {
		db[model].countDocuments(conditions, (err, count) => {
			if (err) {
				reject(err);
			} else {
				resolve(count);
			}
		});
	})

};
const PopulateDocument = (model, docs, options) => {
	return new Promise((resolve, reject) => {
		db[model].populate(docs, options, (err, docs) => {
			if (err) {
				reject(err);
			} else {
				resolve(docs);
			}
		});
	})

};
const RemoveDocument = (model, criteria) => {
	return new Promise((resolve, reject) => {
		db[model].deleteOne(criteria, (err, docs) => {
			if (err) {
				reject(err);
			} else {
				resolve(docs);
			}
		});
	})
};
const GetAggregationDoc = (model, query) => {
	return new Promise((resolve, reject) => {
		db[model].aggregate(query).exec((err, docs) => {
			if (err) {
				reject(err);
			} else {
				resolve(docs);
			}
		});
	});
};
const GetOneDoc = (model, query, projection, extension) => {
	const Query = db[model].findOne(query, projection, extension.options);
	return new Promise((resolve, reject) => {
		if (extension.populate) {
			Query.populate(extension.populate);
		}
		if (extension.sort) {
			Query.sort(extension.sort);
		}
		Query.exec((err, docs) => {
			if (err) {
				reject(err);
			} else {
				resolve(docs);
			}
		});
	});
};
const GetDocs = (model, query, projection, extension) => {
	const Query = db[model].find(query, projection, extension.options);
	return new Promise((resolve, reject) => {
		if (extension.populate) {
			Query.populate(extension.populate);
		}
		if (extension.sort) {
			Query.sort(extension.sort);
		}
		if (extension.limit) {
			Query.limit(extension.limit);
		}
		Query.exec((err, docs) => {
			if (extension.count) {
				Query.countDocuments((err, docs) => {
					if (err) {
						reject(err);
					} else {
						resolve(docs);
					}
				});
			} else {
				if (err) {
					reject(err);
				} else {
					resolve(docs);
				}
			}
		});
	});
};
const UpdateDoc = (model, criteria, doc, options) => {
	return new Promise((resolve, reject) => {
		db[model].updateOne(criteria, doc, options, (err, docs) => {
			if (err) {
				reject(err);
			} else {
				resolve(docs);
			}
		});
	});
};
const InsertDoc = (model, docs) => {
	const doc_obj = new db[model](docs);
	return new Promise((resolve, reject) => {
		doc_obj.save((err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

let ISOBJECTID = e => Types.ObjectId.isValid(e),
	OBJECTID = e => Types.ObjectId(e);


module.exports = {
	UpdateMany: UpdateMany,
	PopulateDocument: PopulateDocument,
	RemoveDocument: RemoveDocument,
	GetCount: GetCount,
	GetAggregationDoc: GetAggregationDoc,
	GetOneDoc: GetOneDoc,
	GetDocs: GetDocs,
	UpdateDoc: UpdateDoc,
	InsertDoc: InsertDoc,
	InsertMultiple: InsertMultiple,
	ISOBJECTID: ISOBJECTID,
	OBJECTID: OBJECTID,
};