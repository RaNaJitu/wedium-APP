const { getCategoryByid } = require('../Categories/functions');
const { createSubCategory, getSubCategoryByid, getAllSubCategory, updateSubCategoryById, deleteSubCategoryById, getSubCategoryByName } = require('../SubCategories/functions');

// GET SubCategory
const createNewSubCategory = async (req, res, next) => {
    try {
        const body = req.body;
        const id = req.body.categoryId;
        if (!(id.match(/^[0-9a-fA-F]{24}$/))) {return res.status(500).json({message :'Invalid Category id.'})};
        const categories = await getCategoryByid(id);
        if (!categories) return res.status(404).json({message : 'Category Not Found '});
        const subCategoryName = await getSubCategoryByName(body.name);
        if (subCategoryName.length === 0) {
            // Validate user input
            if (!(body.categoryId && body.name && body.imagePath)) {
                res.status(404).json("All input is required");
            }
            body.categoryData = categories;
            const SubCategory = await createSubCategory(body);
            res.status(200).json(SubCategory);
        } else {
            res.status(404).json({ message: 'This SubCategory has already been created' });
        }
    } catch (err) {
        return res.sendStatus(500).json({
			error: 'Failed to create SubCategory',
			message: err.message,
		});
    }
};

// retrieve and return all SubCategory/ retrive and return a single SubCategory
const getSubCategory = async (req, res, next) => {
    if (req.query.categoryId) {
        const id = req.query.categoryId;
        getSubCategoryByid(id).then(async SubCategory => {
            try {
                if (!SubCategory && SubCategory.id) {
                    res.status(404).json({ message: "Not found SubCategory with id " + id });
                } else {
                    res.status(200).json(SubCategory);
                }
            } catch (err) {
                res.status(500).json({ message: "Error retrieving SubCategory with id " + id });
            }
        }).catch(err => res.status(500).json(err));
    } else {
        getAllSubCategory().then(SubCategory => {
            res.status(200).json({
                data: SubCategory,
                success: true,
                message: null
            });
        }).catch(err => {
            res.status(500).json({ message: err.message || "Error Occurred while retriving SubCategory information" });
            next(err);
        });
    }
};
//*********************Pagination code for all data*******************************
//     limitPage = parseInt(req.query.limit, 10) || 10;
//     const pageChange = parseInt(req.query.page, 10) || 1;
//     Product.paginate({}, { limit: limitPage, page: pageChange }).populate('category')
//       .then((result) => {
//         return res.status(200).json({
//           message: "GET request to all getAllProducts",
//           dataCount: result.length,
//           result: result,
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(500).json({
//           error: err,
//         });
//       });
//   },


// retrive and return a single SubCategory
const FindOneSubCategory = async (req, res, next) => {
    const id = req.params.id;
    if (!(id.match(/^[0-9a-fA-F]{24}$/))) {return res.status(500).json({message :'Invalid Category id.'})};
    getSubCategoryByid(id).then(async SubCategory => {
        try {
            if (!SubCategory && SubCategory.id) {
                res.status(404).json({ message: "Not found SubCategory with id " + id });
            } else {
                res.status(200).json(SubCategory);
            }
        } catch (err) {
            res.status(500).json({ message: "Error retrieving SubCategory with id " + id });
        }
    }).catch(err => res.status(500).json(err));
};

// update SubCategory
const updateSubCategory = async (req, res, next) => {
    const data = req.body;
    if (!data) {
        return res.status(400).json({ message: "Data to update can not be empty" });
    }
    const id = req.params.id;
    if (!(id.match(/^[0-9a-fA-F]{24}$/))) {return res.status(500).json({message :'Invalid Category id.'})};
    await updateSubCategoryById(id, data).then(data => {
        if (!data) {
            res.status(404).json({ message: `Cannot Update SubCategory with ${id}. Maybe SubCategory not found!` });
        } else {
            res.status(200).json({ message: " Successfully Updated SubCategory information" });
        }
    }).catch(err => {
        res.status(500).json({ message: "Error Update SubCategory information" });
    });
};

//delete subCategory
const deleteSubCategory = async (req, res, next) => {
    const id = req.params.id;
    if (!(id.match(/^[0-9a-fA-F]{24}$/))) {return res.status(500).json({message :'Invalid Category id.'})};
    await deleteSubCategoryById(id).then(data => {
        if (!data) {
            res.status(404).json({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
        } else {
            res.json({
                message: "SubCategory was deleted successfully!"
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: "Could not delete SubCategory with id=" + id
        });
    });
};

module.exports = {
    createNewSubCategory,
    getSubCategory,
    FindOneSubCategory,
    updateSubCategory,
    deleteSubCategory
};