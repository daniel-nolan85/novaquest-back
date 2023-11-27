const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log(`DB Connected`))
  .catch((err) => console.log(`DB Connection Error ${err}`));

app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(cors());

readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

app.listen(port, () => console.log(`Server is running on port ${port}`));
