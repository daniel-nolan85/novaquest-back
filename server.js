const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const socketIo = require('socket.io');
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log(`DB Connected`))
  .catch((err) => console.error(`DB Connection Error ${err}`));

app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(cors());

readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('connected to socket.io');
  socket.on('setup', (_id) => {
    socket.join(_id);
  });

  socket.on('like post', ({ _id, ownerId }) => {
    socket.in(ownerId).emit('post liked', _id);
  });

  socket.on('new comment', ({ _id, ownerId }) => {
    socket.in(ownerId).emit('comment added', _id);
  });

  socket.on('new post', ({ _id, explorer }) => {
    socket.in(explorer).emit('post created', _id);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
