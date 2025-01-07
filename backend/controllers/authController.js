const { registerUser, loginUser, logoutUser } = require('../services/authService');

// ✅ Register User
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await registerUser(email, password);
        res.status(201).json({ message: 'User registered successfully!', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ✅ Login User
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await loginUser(email, password);
        res.status(200).json({ message: 'Login successful!', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ✅ Logout User
const logout = async (req, res) => {
    try {
        await logoutUser();
        res.status(200).json({ message: 'User logged out successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login, logout };