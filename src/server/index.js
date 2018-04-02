import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';

import indexRoutes from './routes/index';
import movieRoutes from './routes/movies';

const app = new Koa();
const PORT = process.env.PORT || 5000;

app.use(logger());
app.use(bodyParser());
app.use(indexRoutes.routes());
app.use(movieRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
