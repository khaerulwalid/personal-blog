const express = require('express');
const route = require('./router');
const app = express();
const session = require('express-session');
app.use(session({
    secret: 'wall rahasia',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: true }
}));

const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));

app.use('/', route)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})