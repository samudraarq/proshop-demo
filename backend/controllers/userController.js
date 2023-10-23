import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); // Find user by email

  if (user && (await user.matchPassword(password))) {
    // If user exists and password matches
    generateToken(res, user._id); // Generate JWT and set as cookie

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error("Invalid email or password");
  }
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email }); // Find user by email

  if (userExists) {
    res.status(400); // Bad request
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id); // Generate JWT and set as cookie

    res.status(201).json({
      // Created
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // Find user by ID

  if (user) {
    res.status(200).json({
      // Send user data
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404); // Not found
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // Find user by ID

  if (user) {
    user.name = req.body.name || user.name; // Update user name
    user.email = req.body.email || user.email; // Update user email

    if (req.body.password) {
      // If password is updated
      user.password = req.body.password; // Update user password
    }

    const updatedUser = await user.save(); // Save updated user

    // generateToken(res, updatedUser._id); // Generate JWT and set as cookie

    res.status(200).json({
      // Send updated user data
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404); // Not found
    throw new Error("User not found");
  }
});

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); // Find all users
  res.status(200).json(users); // Send users data
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password"); // Find user by ID
  if (user) {
    res.status(200).json(user); // Send user data
  } else {
    res.status(404); // Not found
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id); // Find user by ID
  if (user) {
    if (user.isAdmin) {
      res.status(400); // Bad request
      throw new Error("Cannot delete admin user");
    } else {
      await User.deleteOne({
        _id: user._id,
      });
      res.status(200).json({ message: "User deleted" }); // Send success message
    }
  } else {
    res.status(404); // Not found
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id); // Find user by ID
  if (user) {
    user.name = req.body.name || user.name; // Update user name
    user.email = req.body.email || user.email; // Update user email
    user.isAdmin = Boolean(req.body.isAdmin); // Update user admin status

    const updatedUser = await user.save(); // Save updated user

    res.status(200).json({
      // Send updated user data
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404); // Not found
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
