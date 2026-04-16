const { Guest } = require("../models");
const { Op } = require("sequelize");

//req validator
const { createGuestSchema, updateGuestSchema } = require("../validators/guestValidator");
// Find All
exports.findAllGuests = async function (request, response) {
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
            //this means the search term can be anywhere in the first name, last name, phone, email or national id
            {firstName : {[Op.like] : `%${searchTerm}%`}},
            {lastName : {[Op.like] : `%${searchTerm}%`}},
            {phone : {[Op.like] : `%${searchTerm}%`}},
            {email : {[Op.like] : `%${searchTerm}%`}},
            {nationalId : {[Op.like] : `%${searchTerm}%`}}
        ]
    }

    // Find

    // the findandCount returns and object that has two properties count and rows(data)
    //we are giving the count an alias name (total) and the rows an alias name (guests)
    //the findAndCountAll method takes an options object 
    // as an argument where we can specify the limit, offset, order and attributes that we want to return
    const { count: total, rows: guests } = await Guest.findAndCountAll({
        // the limit and skip are now artibutes of the options object that we pass to the findAndCountAll method
        limit,
        offset: skip, 
        where,

        // sort -> order
        order: [["createdAt", "DESC"], ["firstName", "ASC"]],

        // attributes: ["id", "firstName", "lastName", "email"],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        response.status(200).json({
        message: "Guests Found",
        guests,
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
exports.findGuestById = async function (request, response) {
    try {
        const id = request.params.id;
        //the findByPk method is used to find a record by its primary key
        const guest = await Guest.findByPk(id, {
            attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    //handle not found
    if (!guest) {
        return response.status(404).json({ message: "Guest Not Found!" });
    }
    //handle response
    response.status(200).json({ message: "Guest Found", guest });
} catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error!" });
}
};

// Add New Guest
exports.addNewGuest = async function (request, response) {
    try {
        //validate request body
        const { error, value } = createGuestSchema.validate(request.body ,{ abortEarly: false });
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        //check if the national id already exists
        const existingGuest = await Guest.findOne({ where: { nationalId: value.nationalId } });
        if (existingGuest) {
            return response.status(409).json({ message: "Guest with this national ID already exists!" });
        }
        //create guest
        const newGuest = await Guest.create(value);
        //handle response
        response.status(201).json({ message: "Guest Created", guest: newGuest });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};

// Update By Id
exports.updateGuestById = async function (request, response) {
    try {
        //validate request body
        const { error, value } = updateGuestSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        //find guest by id
        const id = request.params.id;
        const guest = await Guest.findByPk(id);
        //handle not found
        if (!guest) {
            return response.status(404).json({ message: "Guest Not Found!" });
        }
        //update guest
        const updatedGuest = await guest.update(value);
        //handle response
        response.status(200).json({ message: "Guest Updated", guest: updatedGuest });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};

// Delete By Id
exports.deleteGuestById = async function (request, response) {
    try
        {    
        //find guest by id
        const id = request.params.id;
        const guest = await Guest.findByPk(id);
        //handle not found
        if (!guest) {
            return response.status(404).json({ message: "Guest Not Found!" });
        }
        //delete guest
        await guest.destroy();
        //handle response
        response.status(200).json({ message: "Guest Deleted" });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};
