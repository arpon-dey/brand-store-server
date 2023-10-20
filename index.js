const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json())


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bpsqjlp.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("productDB").collection("products")
    const cartCollection = client.db("productDB").collection("cart")

    app.get('/products', async(req, res)=> {
        const cursor = productCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/myCart', async(req, res)=> {
        const cursor = cartCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    


    
    app.get('/products/:brandName', async (req, res) => {
        const brandName = req.params.brandName;
        const query = { brandName: brandName };
        const result = await productCollection.find(query).toArray();
        res.send(result);
    });
    app.get('/products/:brandName/:id', async (req, res) => {
        const brandName = req.params.brandName;
        const id = req.params.id
        const query = { brandName: brandName, _id: new ObjectId(id) };
        const result = await productCollection.findOne(query)
        res.send(result);
    });
   
    
    

    app.post('/products',  async(req, res)=>{
        const newProduct = req.body
        const result = await productCollection.insertOne(newProduct)
        res.send(result)

    })
    app.post('/myCart', async(req, res) => {
        const myCart = req.body;
        const result = await cartCollection.insertOne(myCart);
        res.send(result);
    });
    

    // app.post('/myCart', async (req, res) => {
    //     if (req.originalUrl === '/myCart') {
    //         // Handle the request for adding to the cart
    //         const myCart = req.body;
    //         const result = await cartCollection.insertOne(myCart);
    //         res.send(result);
    //     } else if (req.originalUrl === '/products') {
    //         const newProduct = req.body
    //             const result = await productCollection.insertOne(newProduct)
    //             res.send(result)
    //     }
    // });




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res)=>{
    res.send({message: "Server is running on port 5000"})
})

app.listen(port, ()=>{
    console.log(`Server started on ${port}`)
})