const readWrite = require('./readWrite');
const dataPath = './backend/db/products.json';


exports.createProduct = (req, res, next) => {

    readWrite.readFile(dataPath, true, data => {
        const productId = Date.now().toString();
        data[productId] = req.body;
        data[productId]['creator'] = req.userData.userId;

        readWrite.writeFile(dataPath, JSON.stringify(data, null, 2), () => {
            res.status(201).json({
                message: "Product added successfully."
            })
        });
    });
    
}

exports.updateProduct = (req, res, next) => {
    let imagePath = req.body.imagePath;
  
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath =  url + '/images/' + req.file.filename;
    }
  
    try {
        readWrite.readFile(dataPath, true, data => {

            if (data[req.body.id].creator != req.userData.userId) {
                return res.status(401).json({message: 'Not Authoriized.'});
            }

            data[req.body.id] = req.body;
            data[req.body.id].creator = req.userData.userId;

            readWrite.writeFile(dataPath, JSON.stringify(data, null, 2), () => {
                return res.status(201).json({
                    message: "Product updated successfully."
                })
            });
        });
    } 
    catch {
        res.status(500).json({message: "Couldn't update product!" })
    }
}
  
exports.getProducts = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    console.log(req.userData);
    try {
        readWrite.readFile(dataPath, true, data => {
            let filterData = Object.values(data).filter((product) => {
                return product.creator == req.userData.userId;
            })
            return res.status(200)
            .json({
                message : 'Posts fechted successfully.',
                products : filterData.slice(pageSize*(currentPage-1), pageSize*(currentPage-1) + pageSize),
                maxProduct:  filterData.length
            });
        });
    } catch {
        return res.status(500).json({message: 'Fetching post failed!'});
    }
}
  
exports.getProduct = (req, res, next) => {
    try {
        readWrite.readFile(dataPath, true, data => {
            let product = data[req.params.id]
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({message: 'Product not found!'});
            }
        });
    } catch {
        res.status(500).json({message: 'Fetching product failed!'})
    }
}
  
exports.deleteProduct = (req, res, next) => {

    try {
        readWrite.readFile(dataPath, true, data => {
            delete data[req.body.id];
            readWrite.writeFile(dataPath, JSON.stringify(data, null, 2), () => {
                res.status(201).json({
                    message: "Product deleted successfully."
                })
            });
        });
    } 
    catch {
        res.status(500).json({message: 'Deleting update failed!'})
    }
}