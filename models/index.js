// Req Seq
const { sequelize, connectToDB } = require("../config/dbConfig");

// Req Models
const { User } = require("./User");
const { Guest } = require("./Guest");
const { Room } = require("./Room");
const {RoomType}=require("./Roomtype")
const { Booking } = require("./Booking");
const { Payment } = require("./Payment");
const { Service } = require("./Services");
const { BookingService } = require("./BookingService");
// 1 - 1
// Room - RoomType
// M to 1
//many to one from room to roomtype
RoomType.hasMany(Room ,{ foreignKey:{ name: "roomTypeId", allowNull: false },
    //onDelete: "RESTRICT" means that if a room type is deleted, the associated rooms will not be deleted 
    //and will throw an error instead. This is to prevent accidental deletion of room types that are still in use by rooms. 
    onDelete: "RESTRICT",
    //onUpdate: "CASCADE" means that if a room type is updated,
    // the associated rooms will also be updated with the new room type information.
    onUpdate: "CASCADE",
});                                                                                                 
Room.belongsTo(RoomType ,{foreignKey:{ name: "roomTypeId"}});

// M - 1
// Room - Guest -> Booking
// 1 - M
Guest.hasMany(Booking,{ foreignKey:{ name: "guestId", allowNull: false },
    //onDelete: "CASCADE" means that if a guest is deleted, all associated bookings will also be deleted. 
    // This is to maintain data integrity and ensure that there are no orphaned bookings that reference a non-existent guest.
    onDelete: "CASCADE",
    //onUpdate: "CASCADE" means that if a guest is updated, the associated bookings will also be updated with the new guest information.
    onUpdate: "CASCADE",});
Booking.belongsTo(Guest,{foreignKey:{ name: "guestId"}});

// Room - Booking
// 1 - M
Room.hasMany(Booking,{ foreignKey:{ name: "roomId", allowNull: false },
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",

});
Booking.belongsTo(Room,{foreignKey:{ name: "roomId"}});

//Booking - Payment
// 1 - M
Booking.hasMany(Payment,{ foreignKey:{ name: "bookingId", allowNull: false },
    onDelete: "CASCADE"});
Payment.belongsTo(Booking,{foreignKey:{ name: "bookingId"}});

// M - M
// Booking - Service -> BookingService
Booking.belongsToMany(Service, { through: BookingService, foreignKey: {name:"bookingId"}, onDelete: "CASCADE" });
Service.belongsToMany(Booking, { through: BookingService, foreignKey: {name:"serviceId"}, onDelete: "CASCADE" });

module.exports = {
    connectToDB,
    User,
    Guest,
    Room,    
    RoomType,
    Booking,    
    Payment,
    Service,
    BookingService,
    sequelize
};