const { Service } = require("../models");
const { Op } = require("sequelize");

//req validator
const { createServiceSchema, updateServiceSchema } = require("../validators/serviceValidator");
// Find All
exports.findAllServices = async function (request, response) {
    try {
    // Pagination
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const skip = (page - 1) * limit;
    // filtering
    
    const where ={}
    const searchTerm=request.query.searchTerm
    const minPrice = Number(request.query.minPrice);
    const maxPrice = Number(request.query.maxPrice);;
    
    if(searchTerm){
        where[Op.or]=[
            // the iLike operator is used to perform a case-insensitive search
            // the % sign is used to match any number of characters
            // the _ sign is used to match any single character
            //this means the search term can be anywhere in the name or description
            {name : {[Op.like] : `%${searchTerm}%`}},
            {description : {[Op.like] : `%${searchTerm}%`}},
        ]
    }
    if (minPrice && maxPrice) {
    where.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = minPrice;
        if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    // Find

    // the findandCount returns and object that has two properties count and rows(data)
    //we are giving the count an alias name (total) and the rows an alias name (guests)
    //the findAndCountAll method takes an options object 
    // as an argument where we can specify the limit, offset, order and attributes that we want to return
    const { count: total, rows: services } = await Service.findAndCountAll({
        // the limit and skip are now artibutes of the options object that we pass to the findAndCountAll method
        limit,
        offset: skip, 
        where,

        // sort -> order
        order: [["createdAt", "DESC"], ["name", "ASC"]],

        // attributes: ["id", "firstName", "lastName", "email"],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        response.status(200).json({
        message: "Services Found",
        services,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
        skip,
        total,
    });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};

// Find By Id
exports.findServiceById = async function (request, response) {
    try {
        const id = request.params.id;
        //the findByPk method is used to find a record by its primary key
        const service = await Service.findByPk(id, {
            attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    //handle not found
    if (!service) {
        return response.status(404).json({ message: "Service Not Found!" });
    }
    //handle response
    response.status(200).json({ message: "Service Found", service });
} catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error!" });
}
};

// Add New Service
exports.createNewService = async function (request, response) {
    try {
        //validate request body
        const { error, value } = createServiceSchema.validate(request.body ,{ abortEarly: false });
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        // //check if the service already exists
        // const existingService = await Service.findOne({ where: { name: value.name } });
        // if (existingService) {
        //     return response.status(409).json({ message: "Service with this name already exists!" });
        // }
        //create service
        const newService = await Service.create(value);
        //handle response
        response.status(201).json({ message: "Service Created", service: newService });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};

// Update By Id
exports.updateServiceById = async function (request, response) {
    try {
        //validate request body
        const { error, value } = updateServiceSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        //find service by id
        const id = request.params.id;
        const service = await Service.findByPk(id);
        //handle not found
        if (!service) {
            return response.status(404).json({ message: "Service Not Found!" });
        }
        //update service
        const updatedService = await service.update(value);
        //handle response
        response.status(200).json({ message: "Service Updated", service: updatedService });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};

// Delete By Id
exports.deleteServiceById = async function (request, response) {
    try
        {    
        //find service by id
        const id = request.params.id;
        const service = await Service.findByPk(id);
        //handle not found
        if (!service) {
            return response.status(404).json({ message: "Service Not Found!" });
        }
        //delete service
        await service.destroy();
        //handle response
        response.status(200).json({ message: "Service Deleted" });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};
