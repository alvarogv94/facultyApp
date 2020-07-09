// Cargamos express
const express = require('express');
const app = express();

// Cargamos morgan para visualizar las peticiones HTTP en forma de logs
const logger = require('morgan');
const http = require('http');

// Cogemos una posible variable de entorno, y si no está disponible cogemos el 8080
const PORT = process.env.PORT || 8080;

// Cargamos bodyparser para poder convertir a JSON
const bodyParser = require('body-parser');

// Gestion de CORS
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const usersService = require('./routes/users-service');
const jwt = require('jsonwebtoken');
require('./auth.js');


// Configuración de express
app.use(cors());
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
    })
);

const faculties = require('./routes/faculties');
const facultiesService = require('./routes/faculties-service');

app.use('/faculties', faculties);

app.use('/', express.static(path.join(__dirname + '/public')));

app.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
});

app.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                const error = new Error('An Error occurred')
                return next(error);
            } else if (!user) {
                return res.json(info);
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error);
                //We don't want to store the sensitive information such as the
                //user password in the token so we pick only the email and id
                let now = new Date();
                let day = now.getDate();
                let month = now.getMonth() + 1;
                let year = now.getFullYear();
                let hour = now.getHours() + 2;
                let minutes = now.getMinutes();
                let seconds = now.getSeconds();

                if(hour < 10) { hour = '0' + day}
                if(minutes < 10) { minutes = '0' + minutes}
                if(seconds < 10) { seconds = '0' + seconds}


                const body = { 
                    _id: user._id, 
                    email: user.email,
                    valid_from: `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`,
                    valid_until: `${day + 7}/${month}/${year} ${hour}:${minutes}:${seconds}` 
                };
                //Sign the JWT token and populate the payload with the user email and id
                const token = jwt.sign({ user: body }, 'top_secret');
                return res.json({ token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

app.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
    })
});

// Creamos un servidor con la configuración que le hemos asignado a express
const server = http.createServer(app);
const io = require('socket.io')(server);
app.io = io;

io.on('connection', (socket) => {
    console.log('A user connected from ' , socket.handshake.address);
});

usersService.connectDb((err) => {
    if(err) {
        console.log("Could not connect with MongoDB - facultiesService", err);
        process.exit(1);
    }

    facultiesService.connectDb((err) => {
        if(err) {
            console.log("Could not connect with MongoDB - facultiesService", err);
            process.exit(1);
        }
    
        // Arrancamos el servidor
        server.listen(PORT, () => {
            console.log(`Server up and running in localhost:${PORT}`);
        });
    });
});