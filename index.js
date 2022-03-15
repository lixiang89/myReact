import express from "express";

const app = express()
const port=5555

app.use(express.static('src'))

app.get('/', (req, res) => {
  res.redirect('index.html')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})