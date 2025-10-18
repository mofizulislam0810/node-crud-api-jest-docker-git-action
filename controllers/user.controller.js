import User from "../models/user.model.js";

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    user
      ? res.json({ message: 'Deleted' })
      : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
