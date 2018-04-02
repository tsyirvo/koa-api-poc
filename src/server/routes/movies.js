import Router from 'koa-router';
import {
  getAllMovies,
  getSingleMovie,
  addMovie,
  updateMovie,
  deleteMovie,
} from '../db/queries/movies';

const router = new Router();
const BASE_URL = `/api/v1/movies`;

router.get(BASE_URL, async ctx => {
  try {
    const movies = await getAllMovies();
    ctx.body = {
      status: 'success',
      data: movies,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.',
    };
  }
});

router.get(`${BASE_URL}/:id`, async ctx => {
  try {
    const movie = await getSingleMovie(ctx.params.id);

    if (movie.length) {
      ctx.body = {
        status: 'success',
        data: movie,
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That movie does not exist.',
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.',
    };
  }
});

router.post(`${BASE_URL}`, async ctx => {
  try {
    const movie = await addMovie(ctx.request.body);

    if (movie.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: movie,
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Something went wrong.',
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.',
    };
  }
});

router.put(`${BASE_URL}/:id`, async ctx => {
  try {
    const movie = await updateMovie(ctx.params.id, ctx.request.body);

    if (movie.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: movie,
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That movie does not exist.',
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.',
    };
  }
});

router.del(`${BASE_URL}/:id`, async ctx => {
  try {
    const movie = await deleteMovie(ctx.params.id);

    if (movie.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: movie,
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That movie does not exist.',
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.',
    };
  }
});

export default router;
