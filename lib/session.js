// lib/session.js
import session from "express-session";
import MongoStore from "connect-mongo";

let sessionConfig = {
  name: "nextjs-passport",
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    autoRemove: 'interval',
    autoRemoveInterval: 10, // In minutes. Default
  }),
  // TODO: change cookies to local storage
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: "None", // Set the SameSite attribute to None
  },
  resave: false,
  saveUninitialized: false,
};

export default session(sessionConfig);
