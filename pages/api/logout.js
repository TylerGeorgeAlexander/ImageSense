import nextConnect from "next-connect";
import session from "../../lib/session";

export default nextConnect().use(session).post((req, res) => {
  req.logout(); // Assuming you are using Passport.js for authentication, this will clear the user's session

  // Clear cookies
  res.setHeader("Set-Cookie", [
    "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;",
    // Add more cookies if needed
  ]);

  // Optionally, you can perform additional cleanup or actions here
  
  res.status(200).json({ message: "Logged out successfully" });
});
