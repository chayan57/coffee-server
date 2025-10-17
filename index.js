const express = require('express');
 const app=express();
 const cors = require('cors');
 require('dotenv').config();
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


 const port=process.env.PORT || 8000;


 app.use(express.json());
 app.use(cors());




const uri = `mongodb+srv://${process.env.userId}:${process.env.Password}@cluster0.yx95fgn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const server = client.db("cofeesdb");
    const AllCoffees = server.collection("cofee");

    app.get("/",(req,res)=>{
       res.send("server start")
    })
   
     app.get("/coffees",async(req,res)=>{
        const cofee=AllCoffees.find();
        const result=await cofee.toArray();
        res.send(result)
     })
     app.get("/coffees/:id",async(req,res)=>{
        const id=req.params.id;
        const query={_id :new ObjectId(id)};
        const result=await AllCoffees.findOne(query);
        res.send(result)
     })

     app.post("/coffees",async(req,res)=>{
        const newCofee=req.body;
        const result=await AllCoffees.insertOne(newCofee);
        res.send(result)
     })
     app.put("/coffees/:id",async(req,res)=>{
      const id=req.params.id;
      const updateCoffe=req.body;
      const filter={_id :new ObjectId(id)};
      const updateDoc = { $set: updateCoffe };
  const result = await AllCoffees.updateOne(filter, updateDoc);
  res.send(result);
     })

     app.delete("/coffees/:id",async(req,res)=>{
         const deletedId=req.params.id;
         const query={_id :new ObjectId(deletedId)};
         const result=await AllCoffees.deleteOne(query);
         res.send(result)

     })

    
  } finally {
    
  }
}
run().catch(console.dir);



 app.listen(port,()=>{
    console.log("server start",port)
 })
