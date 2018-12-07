const express = require('express')
const cors = require('cors')

const screenshot = require('./screenshot');


const app = express()
const port = 3000

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  screenshot.takeScreenshots(req.query.url).then((screenshot) => {
    res.json({'data': screenshot})
  });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
