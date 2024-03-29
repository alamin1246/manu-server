const express=require('express');
const cors=require('cors');
require('dotenv').config();
const app=express();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
const port=process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jgostwr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
        await client.connect();

        const serviceCollection=client.db('electricalTools').collection('service')
        const orderCollection=client.db('electricalTools').collection('order')
        const ratingCollection=client.db('electricalTools').collection('reviews')
        const userCollection=client.db('electricalTools').collection('user')


// ...............................CREATE....................................

        // Create service (POST)
        app.post("/service",async(req, res) => {
          const service=req.body;
          const result=await serviceCollection.insertOne(service);
          res.json(result);
        
        });

        // insert order
        app.post("/myOrders",async(req, res) => {
            const order=req.body;
            const result=await orderCollection.insertOne(order);
            res.send(result); 
          });

    // POST Review
    app.post("/reviews", async (req, res) => {
        const reviews = req.body;
        const result = await ratingCollection.insertOne(reviews);
        res.json(result);
      });
        

    //   ............................READ...................................................

        // getting service
        app.get("/service",async(req,res)=>{
          const query={}
          const cursor=serviceCollection.find(query)
          const services=await cursor.toArray()
          res.send(services)
        });


         // Get Single service
         app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            console.log("getting specific service", id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
          });
        
        // user
        
        app.get("/user",async(req,res)=>{
          const query={}
          const cursor=userCollection.find(query)
          const users=await cursor.toArray()
          res.send(users)
        });
        
        // order

        app.get("/order",async(req,res)=>{
            const query={}
            const cursor=orderCollection.find(query)
            const orders=await cursor.toArray()
            res.send(orders)
          });


        // get orders by email

        app.get("/myOrders/:email", async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const order = await orderCollection.find(filter).toArray();
            console.log(order);
            res.json(order);
          });

         // Check Admin
          app.get("/user/:email", async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const user = await userCollection.findOne(filter);
            console.log(user);
            res.json(user);
          });
        
          //Get Rating
    app.get("/rating", async (req, res) => {
        const cursor = ratingCollection.find({});
        const rating = await cursor.toArray();
        res.json(rating);
      });

    //   ..........................UPDATE................................

    //   user upsert
app.put('/user/:email', async (req, res) => {
const email=req.params.email;
const user = req.body;
const filter={email:email};
const options={upsert:true};
const updateDocument = {
    $set: user,
};
  const result = await userCollection.updateOne(
    filter,
    updateDocument,
    options
  );
  res.send(result);

});

 //make admin
 app.put("/user/makeAdmin/:email", async (req, res) => {
     const email = req.params.email;
     console.log(email);
    const filter = { email: email };
    const updateDoc = { 
        $set: { role: "admin" }, 
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  });


  // Status update
   app.put("/order/update/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const updatedOrder = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        status: updatedOrder.status,
      },
    };
    const result = await orderCollection.updateOne(
      filter,
      updateDoc,
      options
    );
    console.log("updating", id);
    res.json(result);
  });







//   ....................DELETE..........................

       // DELETE a service
    app.delete("/service/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.deleteOne(query);
        res.json(result);
      });

    // cancel an order
    app.delete("/myOrders/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orderCollection.deleteOne(query);
        res.json(result);
      });

    }
    finally{


    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
   res.send('Hey, Electrical Tools Manufacturer server running') 
});
// app.get('/test', (req, res) => {
//    res.send('Hey, I am testing!') 
// });

app.listen(port, () => {
console.log('Listening on port Electrical Tools Manufacturer',port);
})












