import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect("mongodb+srv://simranjeetkaur:J95wIQrweBiqeqsv@gemaura-db.oszd94c.mongodb.net/?retryWrites=true&w=majority&appName=GemAura-DB")

const userSchema = new mongoose.Schema({
    Email: { type: String, required: true }, 
    password: { type: String, required: true } 
});

const User = mongoose.model('User', userSchema);

app.post("/login", async (req, res) => {
  const { Email, password,enter } = req.body;
  try {
    const user = await User.findOne({ Email: Email });
    if (!user) {
      res.status(404).send({ message: "User not found"});
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send({ message: "Login successful"});
    } else {
      res.status(401).send({ message: "Password didn't match" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});



//SIGNUP 
app.post("/signup", async (req, res) => {
   //console.log("Received signup request:", req.body); 
  const { Email, password,enter } = req.body; 
  try {
    const existingUser = await User.findOne({ Email: Email });
    if (existingUser) {
      //console.log("User already exists");
      return res.status(400).send({ message: "User already exists" });
    }
    if(password !== enter) {
      return res.status(400).send({ message: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      Email: Email,
      password: hashedPassword
    });
    await newUser.save();
    //console.log("New user saved:", newUser); 
    res.send({ message: "Successfully registered" });
  } catch (err) {
    //console.error("Error in signup route:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});



const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully to MongoDB Atlas.');
});

