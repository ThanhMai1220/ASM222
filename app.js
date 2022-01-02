const express = require('express')
const app = express()
const {MongoClient,ObjectId} = require('mongodb')

const DATABASE_URL = 'mongodb+srv://ThanhMai:lop10tao@cluster0.cnhns.mongodb.net/test'
const DATABASE_NAME = 'test'

app.set('view engine','hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))

app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.get('/product',async (req,res)=>{
    //1. lay du lieu tu Mongo
    const dbo = await getDatabase()
    const results = await dbo.collection("Product").find({}).sort({name:1}).limit(7).toArray()
    //2. hien thi du lieu qua HBS
    res.render('product',{product:results})
})

app.get('/home',async (req,res)=>{
    //1. lay du lieu tu Mongo
    const dbo = await getDatabase()
    const results = await dbo.collection("Product").find({}).sort({name:1}).limit(7).toArray()
    //2. hien thi du lieu qua HBS
    res.render('home',{product:results})
})

app.get('/insert',(req,res)=>{
    res.render('product')
})

app.get('/edit',(req,res)=>{
    res.render('edit')
})

app.get('/home',(req,res)=>{
    res.render('home')
})

app.get('/product',(req,res)=>{
    res.render('product')
})

app.post('/home',async (req,res)=>{
    const nameInput = req.body.name
    const passInput = req.body.password
    if(passInput.length< 6){
        res.render('home', {passError: 'Password phai tu 6 ki tu tro len'})
    }
    const newUser = {username:nameInput,password:passInput}

    const collectionname = "home"
    insertObjectToCollection(collectionname,newUser)
    res.render('/')
})

app.post('/product',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    if(isNaN(priceInput)==true){
        //Khong phai la so, bao loi, ket thuc ham
        const errorMessage = "Gia phai la so!" //ktra gia tri la so
        res.render('product',{error:errorMessage,oldValues:oldValues})
        return;
    }
    const newP = {name:nameInput,price:priceInput,picURL:picURLInput}

    const dbo = await getDatabase()
    const result = await dbo.collection("Product").insertOne(newP)
    console.log("Gia tri id moi duoc insert la: ", result.insertedId.toHexString());
    res.redirect('product')
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    console.log("id can xoa:" + id)
    const dbo = await getDatabase()
    dbo.collection("Product").deleteOne({id:ObjectId(id)})
    res.redirect('product')
})

app.get('/edit/:id', async (req, res) => {
    const idValue = req.params.id
    //lay thong tin cu cua sp cho nguoi dung xem, sua
    const productToEdit = await getDocumentById(idValue, "Product")
    //hien thi ra de sua
    res.render("edit", { product: productToEdit })
})


const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')

async function getDatabase() {
    const client = await MongoClient.connect(DATABASE_URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo
}