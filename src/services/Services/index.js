// const Services = require('../../dao/queries/model/services');
const { getSubCategoryByid } = require('../SubCategories/functions');
const { createServices, getServicesByid, BestSeller, getAllServices, updateServicesById, deleteServicesById, getServicesByName } = require('../Services/function');

// GET Services
const createNewServices = async (req, res, next) => {
    try {
        const body = req.body;
        const id = req.body.subCatgoryId;
        if (!(id.match(/^[0-9a-fA-F]{24}$/))) {return res.status(500).json({message :'Invalid Category id.'})};
        const SubCategory = await getSubCategoryByid(id);
        if (!SubCategory) return res.status(404).json({ message: 'SubCategory Not Found ' });
        const ServicesName = await getServicesByName(body.name);
        if (ServicesName.length === 0) {
            // Validate services input
            if (!(body.subCatgoryId && body.name && body.image)) {
                res.status(404).json("All input is required");
            }
            body.subCatgoryData = SubCategory;
            const services = await createServices(body);
            res.status(200).json(services);
        } else {
            res.status(404).json({ message: 'This Services has already been created' });
        }
    } catch (err) {
        return res.sendStatus(500).json({
			error: 'Failed to create Services',
			message: err.message,
		});
    }
};

// retrieve and return all Services/ retrive and return a single Services
const getServices = async (req, res, next) => {
    if (req.query.subCatgoryId) {
        const id = req.query.subCatgoryId;
        getServicesByid(id).then(async Services => {
            try {
                if (!Services && Services.id) {
                    res.status(404).json({ message: "Not found Services with id " + id });
                } else {
                    res.status(200).json(Services);
                }
            } catch (err) {
                res.status(500).json({ message: "Error retrieving Services with id " + id });
            }
        }).catch(err => res.status(500).json(err));
    } else {
        getAllServices().then(Services => {
            res.status(200).json({
                data: Services,
                success: true,
                message: null
            });
        }).catch(err => {
            res.status(500).json({ message: err.message || "Error Occurred while retriving Services information" });
            next(err);
        });
    }
};

const getBestSeller = async (req, res, next) => {
    BestSeller().then(Services => {
        res.status(200).json({
            data: Services,
            success: true,
            message: null
        });
    }).catch(err => {
        res.status(500).json({ message: err.message || "Error Occurred while retriving Services information" });
        next(err);
    });
};
// retrive and return a single Category
const FindOneServices = async (req, res, next) => {
    const id = req.params.id;
    if (!(id.match(/^[0-9a-fA-F]{24}$/))) {return res.status(500).json({message :'Invalid Category id.'})};
    getServicesByid(id).then(async Services => {
        try {
            if (!Services && Services.id) {
                res.status(404).json({ message: "Not found Services with id " + id });
            } else {
                res.status(200).json(Services);
            }
        } catch (err) {
            res.status(500).json({ message: "Error retrieving Services with id " + id });
        }
    }).catch(err => res.status(500).json(err));
};

// update Services
const updateServices = async (req, res, next) => {
    const data = req.body;
    if (!data) {
        return res.status(404).json({ message: "Data to update can not be empty" });
    }
    const id = req.params.id;
    if (!(id.match(/^[0-9a-fA-F]{24}$/))) {return res.status(500).json({message :'Invalid Category id.'})};
    await updateServicesById(id, data).then(data => {
        if (!data) {
            res.status(404).json({ message: `Cannot Update Services with ${id}. Maybe Services not found!` });
        } else {
            res.status(200).json({ message: " Successfully Updated Services information" });
        }
    }).catch(err => {
        res.status(500).json({ message: "Error Update Services information" });
    });
};
// delete services
const deleteServices = async (req, res, next) => {
    const id = req.params.id;
    if (!(id.match(/^[0-9a-fA-F]{24}$/))) {return res.status(500).json({message :'Invalid Category id.'})};
    await deleteServicesById(id).then(data => {
        if (!data) {
            res.status(404).json({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
        } else {
            res.status(200).json({
                message: "Services was deleted successfully!"
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: "Could not delete Services with id=" + id
        });
    });
};

module.exports = {
    createNewServices,
    getServices,
    FindOneServices,
    updateServices,
    deleteServices,
    getBestSeller
};