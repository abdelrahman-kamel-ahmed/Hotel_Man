const express = require("express");
// Req Database
const { connectToDB } = require("./models");

// create express app
const app = express();

// listen for requests
const PORT = process.env.PORT ?? 3000;

// Middlewares
app.use(express.json());

// Routes
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/guests", require("./routes/guestRoute"));

app.use("/api/v1/rooms", require("./routes/roomRoutes"));
app.use("/api/v1/room-types", require("./routes/roomTypeRoutes"));
app.use("/api/v1/services", require("./routes/serviceRoutes"));


// Database Connection
connectToDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));