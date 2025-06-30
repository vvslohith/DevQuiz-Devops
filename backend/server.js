const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('MongoDB URL from env:', process.env.MONGO_URL);


// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
console.log('Connecting to MongoDB with URL:', process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// UserResult model
const userResultSchema = new mongoose.Schema({
    username: { type: String, required: true },
    domain: { type: String, required: true },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true }, // Time in seconds
    timestamp: { type: Date, default: Date.now }  // Automatically set the current timestamp
});

const domainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
});

const questionSchema = new mongoose.Schema({
    domain: { type: String, required: true },
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true }
});

const Domain = mongoose.model('Domain', domainSchema);
const Question = mongoose.model('Question', questionSchema);
const UserResult = mongoose.model('UserResult', userResultSchema);

// Quiz result submission
app.post('/api/submit', async (req, res) => {
    try {
        const { username, domain, score, timeTaken } = req.body;

        // Create new result
        const newResult = new UserResult({
            username,
            domain,
            score,
            timeTaken
        });

        // Save the result, with the timestamp being automatically added
        await newResult.save();

        res.json({ message: 'Result saved successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Error saving result', error: err });
    }
});

// Leaderboard for a specific domain
app.get('/api/leaderboard/:domain', async (req, res) => {
    try {
        const { domain } = req.params;
        const topResults = await UserResult.find({ domain })
            .sort({ score: -1, timeTaken: 1 }) // First by score (descending), then by timeTaken (ascending)
            .limit(10); // Limit to top 10 results
        res.json(topResults);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching leaderboard', error: err });
    }
});

// Leaderboard for a specific user in a domain
app.get('/api/leaderboard/:domain/:username', async (req, res) => {
    try {
        const { domain, username } = req.params;

        // Fetch all results for this domain, sorted by score and timeTaken
        const allResults = await UserResult.find({ domain })
            .sort({ score: -1, timeTaken: 1 }); // Sort by score (descending), and timeTaken (ascending)

        // Find the user's rank in the leaderboard
        const userIndex = allResults.findIndex(result => result.username.toLowerCase() === username.toLowerCase());
        const userRank = userIndex !== -1 ? userIndex + 1 : null;

        // Filter out the user's attempts
        const userAttempts = allResults.filter(result => result.username.toLowerCase() === username.toLowerCase());

        res.json({
            rank: userRank,
            attempts: userAttempts
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user leaderboard info', error: err });
    }
});

// Endpoint to get questions for a specific domain
app.get('/api/questions/:domain', async (req, res) => {
    const { domain } = req.params;
    try {
        const questions = await Question.find({ domain });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load questions' });
    }
});

// Get all domains
app.get('/api/domains', async (req, res) => {
    try {
        const domains = await Domain.find(); // Fetch all domains from MongoDB
        res.json(domains);
    } catch (error) {
        console.error('Error fetching domains:', error);
        res.status(500).json({ error: 'Failed to fetch domains' });
    }
});

// Insert test data for MongoDB testing
const insertTestData = async () => {
  try {
    // Insert two domains
    const domains = [
      { name: 'Mathematics', description: 'Math quiz domain' },
      { name: 'Science', description: 'Science quiz domain' }
    ];

    // Insert domains into the database
    await Domain.insertMany(domains);
    console.log('Domains inserted successfully');

    // Insert two questions for each domain
    const questions = [
      { domain: 'Mathematics', questionText: 'What is 2 + 2?', options: ['2', '3', '4', '5'], correctAnswer: '4' },
      { domain: 'Science', questionText: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'N2'], correctAnswer: 'H2O' }
    ];

    // Insert questions into the database
    await Question.insertMany(questions);
    console.log('Questions inserted successfully');

    // Insert two user results
    const userResults = [
      { username: 'Alice', domain: 'Mathematics', score: 5, timeTaken: 60 },
      { username: 'Bob', domain: 'Science', score: 4, timeTaken: 45 }
    ];

    // Insert random user results into the database
    const userResultEntries = userResults.map(user => {
      return new UserResult({
        username: user.username,
        domain: user.domain,
        score: user.score,
        timeTaken: user.timeTaken
      });
    });

    await UserResult.insertMany(userResultEntries);
    console.log('User results inserted successfully');
  } catch (err) {
    console.error('Error inserting test data:', err);
  }
};

// Call the test data insertion function
// insertTestData();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
