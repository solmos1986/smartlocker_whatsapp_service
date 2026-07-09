const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const movementRoutes = require('./routes/movement.routes');
const syncRoutes = require('./routes/sync.routes');

const path = require('path');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());

app.use('/api/v1/movement', movementRoutes);
app.use('/api/v1/sync', syncRoutes);
app.use(
    '/storage',
    express.static(path.join(__dirname, '..', 'storage'))
);
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

module.exports = app;