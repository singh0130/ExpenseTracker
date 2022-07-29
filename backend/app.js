//Built-in modules
const fs= require('fs');
const path= require('path');
const https= require('https');
//installed modules
const express= require('express');
const bodyParser = require('body-parser');
const cors= require('cors');
const dotenv= require('dotenv');
const helmet= require('helmet');
const compression= require('compression');
const morgan= require('morgan');
//user-defined modules
const sequelize= require('./util/database');
const User= require('./models/user');
const Expense= require('./models/expenses');
const Orders= require('./models/orders');
const ForgotPass= require('./models/forgotpassword');

//Routes
const userRoutes= require('./routes/user');
const purchaseRoutes= require('./routes/purchase');
const resetPasswordRoutes= require('./routes/forgotpassword');

const accessLogStream= fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
const privateKey= fs.readFileSync('server.key');
const certificate= fs.readFileSync('server.cert');

dotenv.config();
const app= express();
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));


app.use(userRoutes);
app.use(purchaseRoutes);
app.use(resetPasswordRoutes);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Orders);
Orders.belongsTo(User);

User.hasMany(ForgotPass);
ForgotPass.belongsTo(User);

sequelize
//.sync({force: true})
.sync()
.then(() => {
    https.createServer({key: privateKey, cert: certificate}, app).listen(3000);
})
.catch(err => {
    console.log(err);
});