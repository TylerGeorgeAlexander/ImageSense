import nextConnect from "next-connect";
import passport from "../../lib/passport";
import session from "../../lib/session";
import jwt from "jsonwebtoken";

export default nextConnect()
  .use(session)
  .use(passport.initialize())
  .use(passport.session())
  .post((req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        // Handle passport authentication error
        return next(err);
      }
      if (!user) {
        // Handle authentication failure
        return res.status(401).json({ message: info.message });
      }

      // Generate a token for the user
      const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, {
        expiresIn: "1d",
      });
      // Send the user and token in the response
      return res.status(200).json({ user, token });
    })(req, res, next);
  });
