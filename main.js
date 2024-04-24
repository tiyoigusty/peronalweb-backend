const express = require("express")
const app = express()
const port = 5000

// route
app.get("/hello", (req, res) => {
    res.send("HELLO WORLD EDITED")
})

app.listen(port, () => {
    console.log("server runing");
})