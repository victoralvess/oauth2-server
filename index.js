const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/hello', (req, res) => {
	res.send("It's working!\n");
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running at: http://localhost:${process.env.PORT || 3000}/`);
});