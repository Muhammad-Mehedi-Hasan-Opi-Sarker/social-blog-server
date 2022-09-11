const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()
const cors = require('cors')

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.plc2a6f.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const socialCollection = client.db('allCollection').collection('post');

        app.post('/post', async(req,res)=>{
            const post = req.body;
            const result = await socialCollection.insertOne(post);
            res.send(result);
        })
    }
    finally{

    }

}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('connected')
})

app.listen(port,()=>{
    console.log('Server is running');
})