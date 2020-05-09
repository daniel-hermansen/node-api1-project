const express = require('express');
const db = require('./database.js');

const server = express();

server.use(express.json());


// --------------------------------------------------------------
// Create Method
// --------------------------------------------------------------

server.post('/api/users', (req, res) => {
    const newUser = db.createUser({
        name: req.body.name,
        bio: req.body.bio,
    })

    if(newUser) {
        try{
            res.status(201).json(newUser)
        } catch {
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database"})
        }
    } else {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
    } 
})

// --------------------------------------------------------------
// Read Method
// --------------------------------------------------------------

server.get('/api/users', (req, res) => {
    const users = db.getUsers();

    if (users) {
        res.json(users)
    } else {
        return res.status(500).json({ errorMessage: "The users information could not be retrieved."})
    }
})

// --------------------------------------------------------------
// Read Method (id)
// --------------------------------------------------------------

server.get('/api/users/:id', (req, res) => {
    const userId = req.params.id
    const user = db.getUserById(userId);

    if(user) {
        try {
            res.json(user)
        } catch {
            res.status(500).json({ errorMessage: "The user information could not be retrieved."})
        }
    } else {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist"})
    }
})

// --------------------------------------------------------------
// Delete Method
// --------------------------------------------------------------

server.delete('/api/users/:id', (req, res) => {
    const user = db.getUserById(req.params.id);

    if(user){
        try {
            db.deleteUser(user.id)
            res.status(204).end()
        } catch {
            res.status(500).json({ errorMessage: "The user could not be removed."})
        }
    } else {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist."})
    }

})

// --------------------------------------------------------------
// Update Method
// --------------------------------------------------------------

server.put('/api/users/:id', (req, res) => {
    const user = db.getUserById(req.params.id);

    if(user) {
        try {
            const updatedInfo = db.updateUser(user.id, {
                name: req.body.name || user.name,
                bio: req.body.bio || user.bio,
            })
            res.status(200).json(updatedInfo)
        } catch {
            res.status(500).json({errorMessage: "The user information could not be modified."})
        }
    } else {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist."})
    }
})

//-----------------------------------------------------------------------------

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})