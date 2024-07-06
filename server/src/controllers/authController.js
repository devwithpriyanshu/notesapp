import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    user = new User({
      username,
      email,
      passwordHash,
      passwordSalt: salt,
    });

    await user.save();


    res.status(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secret123',
      // { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


export { register, login };
