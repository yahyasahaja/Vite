const express = require('express');
const app = express();

app.use(express.static('./public'));

app.get('/', (req, res) => {

});

app.listen(3000, () => console.log('server runnning at port 3000'));