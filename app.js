if (process.env.NODE_ENV!=="production") {
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const errorApp=require('./utilities/errorApp');
const mongoose=require('mongoose');
const passport=require('passport');
const helmet=require("helmet");
const LocalStrategy=require('passport-local');
const mongoSanitize=require('express-mongo-sanitize');
const MongoStore=require('connect-mongo');
const User=require('./models/user');

const userRoutes=require('./routes/users');
const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');
const { error }=require('console');
const dbUrl=process.env.DB_URL;

main().catch(err => console.log(err));
// 'mongodb://127.0.0.1:27017/yelpCamp'

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp');
    console.log("Established Connection with Mongo")
}

const store=MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60,
    crypto: {
        secret: 'thisisasecret!'
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig={
    store,
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls=[
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls=[
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls=[
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls=[];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzxv7wkgg/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
});

app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new errorApp('Page not found.', 404));
});

app.use((err, req, res, next) => {
    const { statusCode=500 }=err;
    if (!err.message) err.message='Something went wrong.';
    res.status(statusCode).render('error', { err });
    console.log(error)
});

app.listen(3000, () => {
    console.log("your server is localhost/3000");
});