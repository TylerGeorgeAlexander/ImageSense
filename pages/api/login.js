import nextConnect from "next-connect";
import passport from "../../lib/passport";
import session from "../../lib/session";
import jwt from "jsonwebtoken";

export default nextConnect()
  .use(session)
  .use(passport.initialize())
  .use(passport.session())
  .post(passport.authenticate("local"), (req, res) => {
    // Generate a token for the user
    const token = jwt.sign({ id: req.user.id }, process.env.SESSION_SECRET, {
      expiresIn: "1d",
    });
    // Send the user and token in the response
    res.status(200).json({ user: req.user, token: token });
  });
