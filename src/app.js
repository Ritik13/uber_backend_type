const express = require('express');
const sequelize = require('./config/database');
const { Sequelize, json } = require('sequelize');
const riderRouter = require('./routes/rider.route');
const driverRouter = require('./routes/driver.route');
const matchRouter = require('./routes/match.route');


const RiderModel = require('./models/Rider.model')(sequelize , Sequelize.DataTypes)
const DriverModel = require('./models/Driver.model')(sequelize, Sequelize.DataTypes);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Uber Dispatch Core System is running!');
});

app.use("/api" , riderRouter)
app.use('/api', driverRouter);
app.use('/api', matchRouter);



// Test DB Connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully.');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
