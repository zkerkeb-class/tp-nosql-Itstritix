import User from "../models/user.js";
import { generateToken } from "../middlewares/authMiddleware.js";

const registerController = async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    return res.status(403).json({message: "User already exist"});
  }

  const user = new User({
    username,
    email,
    password,
  });
  await user.save();

  res.status(201).json({
    message: "User registered with success",
  });
};

const loginController = async (req, res, next) => {
    const { username, password } = req.body
    const existingUser = await User.findOne({username});

    if (!existingUser) {
        return res.status(401).json({message: "User do not exist"});
    }

    const passwordMatch = await existingUser.comparePassword(password);

    if (!passwordMatch) {
        return res.status(401).json({message: "User do not exist"});
    }

    const jwtToken = generateToken(existingUser._id);

    return res.status(200).json({
            message: "Login successful",
            token: jwtToken
        });
}

export { registerController, loginController };