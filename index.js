const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const likeCollection = client.db('allCollection').collection('like');
        const commentCollection = client.db('allCollection').collection('comment');

        // post for data 
        app.post('/post', async(req,res)=>{
            const post = req.body;
            const result = await socialCollection.insertOne(post);
            res.send(result);
        })

        app.get('/post', async(req,res)=>{
            const query ={};
            const cursor = socialCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/post/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const post = await socialCollection.findOne(query);
            res.send(post);
        })

        // like for 
        app.put('/like/:email', async(req,res)=>{
            const email = req.params.email;
            const user=req.body;
            const filter = {eamil:email};
            const options = {upsert: true};
            const updateDoc = {
                $set:user,
            };
            const result = await likeCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        // comment 
        app.post('/comment', async(req,res)=>{
            const comment = req.body;
            const result = await commentCollection.insertOne(comment)
            res.send(result);
        })
        app.get('/comment', async(req,res)=>{
            const id = req.query.id;
            const query= {id:id};
            const result = await commentCollection.find(query).toArray();
            res.send(result)
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