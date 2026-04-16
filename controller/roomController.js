const { Room, RoomType } = require("../models");
const { Op } = require("sequelize");

//req validator
const { createRoomSchema, updateRoomSchema } = require("../validators/guestValidator");
// Find All
exports.findAllRooms = async function (request, response) {
    try {
    // Pagination
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const skip = (page - 1) * limit;
    // filtering
    
    const where ={}
    const searchTerm=request.query.searchTerm;
    
    if(searchTerm){

        where[Op.or]=[
            // the iLike operator is used to perform a case-insensitive search
            // the % sign is used to match any number of characters
            // the _ sign is used to match any single character
            //this means the search term can be anywhere in the room number, floor, or status
            {roomNumber : {[Op.like] : `%${searchTerm}%`}},
            {floor : {[Op.like] : `%${searchTerm}%`}},
            {status : {[Op.like] : `%${searchTerm}%`}},
        
        ]
    }

    // Find

    // the findandCount returns and object that has two properties count and rows(data)
    //we are giving the count an alias name (total) and the rows an alias name (guests)
    //the findAndCountAll method takes an options object 
    // as an argument where we can specify the limit, offset, order and attributes that we want to return
    const { count: total, rows: rooms } = await Room.findAndCountAll({
        // the limit and skip are now artibutes of the options object that we pass to the findAndCountAll method
        limit,
        offset: skip, 
        where,

        // sort -> order
        order: [["createdAt", "DESC"], ["roomNumber", "ASC"]],

        // this is going to bring the whole room type object that is associated with the room
        //not only the room type id but also the room type name and description
        include: RoomType,
        });

        response.status(200).json({
        message: "Rooms Found",
        rooms,
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
exports.findRoomById = async function (request, response) {
    try {
        const id = request.params.id;
        //the findByPk method is used to find a record by its primary key
        const room = await Room.findByPk(id, {
            include: RoomType,
    });
    //handle not found
    if (!room) {
        return response.status(404).json({ message: "Room Not Found!" });
    }
    //handle response
    response.status(200).json({ message: "Room Found", room });
} catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error!" });
}
};

// Add New Room
exports.createRoom = async function (request, response) {
    try {
        //validate request body
        const { error, value } = createRoomSchema.validate(request.body ,{ abortEarly: false });
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        //check if the room number already exists
        const existingRoom = await Room.findOne({ where: { roomNumber: value.roomNumber } });
        if (existingRoom) {
            return response.status(409).json({ message: "Room with this room number already exists!" });
        }
        //create room
        const newRoom = await Room.create(value);
        //handle response
        response.status(201).json({ message: "Room Created", room: newRoom });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};

// Update By Id
exports.updateRoomById = async function (request, response) {
    try {
        //validate request body
        const { error, value } = updateRoomSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        //find room by id
        const id = request.params.id;
        const room = await Room.findByPk(id);
        //handle not found
        if (!room) {
            return response.status(404).json({ message: "Room Not Found!" });
        }
        //update room
        const updatedRoom = await room.update(value);
        //handle response
        response.status(200).json({ message: "Room Updated", room: updatedRoom });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};

// Delete By Id
exports.deleteRoomById = async function (request, response) {
    try
        {    
        //find room by id
        const id = request.params.id;
        const room = await Room.findByPk(id);
        //handle not found
        if (!room) {
            return response.status(404).json({ message: "Room Not Found!" });
        }
        //delete room
        await room.destroy();
        //handle response
        response.status(200).json({ message: "Room Deleted" });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};
