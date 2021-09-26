const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')
var corsOptions = {
    origin: ' http://192.168.1.103:8080',
    credentials: false,
    optionsSuccessStatus: 200 // For legacy browser support
}
const authRoutes = require('./app/routes/authRoutes');
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);

const http = require('http').createServer(app);

/**      DB Config     **/
const configDB = require("./app/config/dbConnect");

const { addUser, getUser, removeUser } = require('./helper');

/**      Socket Config      **/
require("./app/socket/index")(http , addUser, getUser, removeUser);

const PORT = process.env.PORT || 3000;
app.get('/set-cookies', (req, res) => {
    res.cookie('username', 'Ahmed');
    res.cookie('isAuthenticated', true, { maxAge: 24 * 60 * 60 * 1000 });
    res.send('cookies are set');
})
app.get('/get-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.json(cookies);
})
http.listen(PORT, '192.168.1.103',() => {
    console.log(`listening on port ${PORT}`);
});
