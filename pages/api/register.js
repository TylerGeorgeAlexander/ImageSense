import connectDB from "../../lib/connectDB";
import User from "../../models/User";

connectDB();

export default async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
};
