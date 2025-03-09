// we are Loading the required modules
const express = require('express')
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./src/Config/db')
const path = require('path');
const cron = require('node-cron');


dotenv.config();


const authRoutes = require('./src/routes/authRoutes')
const documentRoutes = require('./src/routes/documentRoutes');
const creditsRoutes = require('./src/routes/creditRoutes');
const adminRoutes = require('./src/routes/adminRoutes')

const {resetDailycredits} = require('./src/Controllers/Controllerforcredit');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); 


app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Frontend/index.html'));
})


app.use(express.static(path.join(__dirname, './Frontend')));

// Thid is Schedule daily credit reset
cron.schedule("0 0 * * *", resetDailycredits);


var serverPort = process.env.PORT;
app.listen(serverPort, () => {
    console.log(`server is connected to ${serverPort}`);
})