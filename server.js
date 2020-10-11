const express = require('express');

const app = express();

app.use(express.static('./dist/user-task-ui'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/user-task-ui/'}),
);

app.listen(process.env.PORT || 8080);
