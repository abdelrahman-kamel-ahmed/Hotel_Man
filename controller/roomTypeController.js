const { RoomType } = require("../models");
const { Op } = require("sequelize");

//req validator
const { createRoomTypeSchema, updateRoomTypeSchema } = require("../validators/roomTypeValidator");
// Find All
exports.findAllRoomTypes = async function (request, response) {
try {
    // Pagination
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const skip = (page - 1) * limit;
    // filtering
    
    const where ={}
    const searchTerm=request.query.searchTerm;
    const minPrice = Number(request.query.minPrice);
    const maxPrice = Number(request.query.maxPrice);
    const capacity = Number(request.query.capacity);
    
    if(searchTerm){
        where.name={[Op.like] : `%${searchTerm}%`};
    }
    if (minPrice && maxPrice) {
    where.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = minPrice;
        if (maxPrice) where.price[Op.lte] = maxPrice;
    }


    //find the exact capacity
    if(capacity){
        where.capacity=capacity;
    }
    // Find

    // the findandCount returns and object that has two properties count and rows(data)
    //we are giving the count an alias name (total) and the rows an alias name (guests)
    //the findAndCountAll method takes an options object 
    // as an argument where we can specify the limit, offset, order and attributes that we want to return
    const { count: total, rows: roomTypes } = await RoomType.findAndCountAll({
        // the limit and skip are now artibutes of the options object that we pass to the findAndCountAll method
        limit,
        offset: skip, 
        where,

        // sort -> order
        order: [["createdAt", "DESC"], ["name", "ASC"], ["capacity", "ASC"], ["price", "ASC"]],

        });

        response.status(200).json({
        message: "Room Types Found",
        roomTypes,
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
exports.findRoomTypeById = async function (request, response) {
    try {
        const id = request.params.id;
        //the findByPk method is used to find a record by its primary key
        const roomType = await RoomType.findByPk(id, {
            attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    //handle not found
    if (!roomType) {
        return response.status(404).json({ message: "Room Type Not Found!" });
    }
    //handle response
    response.status(200).json({ message: "Room Type Found", roomType });
} catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error!" });
}
};

// Add New Room Type
exports.createNewRoomType = async function (request, response) {
    try {
        //validate request body
        const { error, value } = createRoomTypeSchema.validate(request.body ,{ abortEarly: false });
        if (error) {
            const errors = error.details.map(err => err.message);
            return res.status(400).json({message: "Validation Error", errors});
        }
        //create room type
        const newRoomType = await RoomType.create(value);
        //handle response
        response.status(201).json({ message: "Room Type Created", roomType: newRoomType });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};

// Update By Id
exports.updateRoomTypeById = async function (request, response) {
    try {
        //validate request body
        const { error, value } = updateRoomTypeSchema.validate(request.body);
        if (error) {
            const errors = error.details.map(err => err.message);
            return res.status(400).json({message: "Validation Error", errors});
        }
        //find room type by id
        const id = request.params.id;
        const roomType = await RoomType.findByPk(id);
        //handle not found
        if (!roomType) {
            return response.status(404).json({ message: "Room Type Not Found!" });
        }
        //update room type
        const updatedRoomType = await roomType.update(value);
        //handle response
        response.status(200).json({ message: "Room Type Updated", roomType: updatedRoomType });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};

// Delete By Id
exports.deleteRoomTypeById = async function (request, response) {
    try
        {    
        //find room type by id
        const id = request.params.id;
        const roomType = await RoomType.findByPk(id);
        //handle not found
        if (!roomType) {
            return response.status(404).json({ message: "Room Type Not Found!" });
        }
        //delete room type
        await roomType.destroy();
        //handle response
        response.status(200).json({ message: "Room Type Deleted" });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};
