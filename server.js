require('dotenv').config();
const express = require('express');
const sequelize = require('./config/dbConfig');
const mainRoutes = require('./routes/mainRoutes');
const nocache = require('nocache');
const cors = require('cors')


const app = express();
app.use(express.json());
app.use(nocache());
app.use(cors())

app.use('/api', mainRoutes);


app.get("/", (req, res) => {
    return res.status(200).json({ message: 'Server is up and running.' })
})


// {alter:true}
sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => console.error('Database connection failed:', err));
