const express = require("express")
const mongoose = require("mongoose")
const route = require("./routes/route")

const app = express();
const multer = require('multer');

app.use(express.json())
app.use(multer().any())

mongoose.connect("mongodb+srv://anik2310:anik123@cluster0.tby9aun.mongodb.net/group61Database", 
{ useNewUrlParser: true }
)

.then(() => console.log("MongoDb is connected🙏🙏"))
.catch(err => console.log(err))

app.use('/', route)
let PORT = process.env.PORT || 3000

app.listen(PORT, function () {
    console.log(`Express app running on port ${PORT} 😍😍` )
})
