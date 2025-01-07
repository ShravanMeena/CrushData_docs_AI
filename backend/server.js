const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const { verifyToken } = require('./middlewares/authMiddleware'); // ✅ Import middleware

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());



// ✅ Apply Token Verification Globally (Except for Auth Routes)
app.use('/api/v1/auth', authRoutes);  // Auth routes do not require token validation
app.use(verifyToken);  // ✅ Secure all other routes after this line

// ✅ Protected Routes
app.use('/api/v1/chat', chatRoutes);

app.use('/', (req,res) =>{
    return res.send("Health-Check")
});


// Server Listening
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});