const express = require('express');
const app = express();

const connectionString = "mongodb://localhost:27017/user_info"
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(express.json());
app.use(express.urlencoded());

app.get('/users', (req, res) => {
    client.connect((err, connectedClient) => {
        if (err) return res.status(500).json({message: err});
        const db = connectedClient.db();
        db.collection("users").find({}).toArray((err,result) => {
            if (err) {
                return res.status(500).json({message: err});
            }
            return res.status(200).json({users: result})
        })
    })
})

app.post('/users', (req,res) => {
    client.connect((err, connectedClient) => {
        if (err) {
            return res.status(500).json({message: err});
        }
        const db = connectedClient.db();
        db.collection("users").insertOne({
            name: req.body.name,
            email: req.body.email,
            country: req.body.country
        }, (err, result) => {
            if(err) return res.status(500).json({message: err});
            res.status(200).json({message: "new user added"})
        })
    })
})


app.listen(4000, () => console.log('server up and running'))