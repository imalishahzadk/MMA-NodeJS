const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, password, address, phone, answer } = req.body;
    // validation
    if (!name) {
      res.send({ message: "Name is Required" });
    }
    if (!email) {
      res.send({ message: "Email is Required" });
    }
    if (!password) {
      res.send({ message: "Password is Required" });
    }
    if (!address) {
      res.send({ message: "Address is Required" });
    }
    if (!phone) {
      res.send({ message: "Contact Number is Required" });
    }
        if (!answer) {
          res.send({ message: "Answer is Required" });
        }
    //check user
    const existingUser = await userModel.findOne({ email: email });
    //existing user
    if (existingUser) {
      res.send({
        success: false,
        message: "Already Registered! Please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save to database
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      answer
    }).save();
    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration...",
      error,
    });
  }
};

// Login method
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate
    if (!email || !password) {
      res.status(404).send({
        success: false,
        message: "Invalid email or password...",
      });
    }
    //check user
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully...",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
// forgot password function
const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ error: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ error: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ error: "New Password is required" });
    }
    // check

    const user = await userModel.findOne({ email, answer })
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer"
      })
    
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed })
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully"
    }) 
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// test controller
const testController = (req, res) => {
  res.send("test route");
};

module.exports = {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
};
