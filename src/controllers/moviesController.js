const path = require("path");
const db = require("../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");



//Aqui tienen otra forma de llamar a cada uno de los modelos (quite arriba 'moment')
// const Movies = db.Movie;
// const Genres = db.Genre;
// const Actors = db.Actor;

// añadi const: createError, paginate, const {}.
const createError = require('http-errors');
const paginate = require('express-paginate')
const { getAllMovis, getMovieById, createMovie, updateMovie, deleteMovie } = require("../services/movies.services");

// descomille funciones list y detail, create, update, destroy. añadi async. 
const moviesController = {
  list: async (req, res) => {
    try {
      const { keyword } = req.query
      const { movies, total } = await getAllMovis(req.query.limit, req.skip, keyword);
      const pagesCount = Math.ceil(total / req.query.limit)
      const currentPage = req.query.page;
      const pages = paginate.getArrayPages(req)(
        pagesCount,
        pagesCount,
        currentPage
      )

      return res.status(200).json({
        ok: true,
        meta: {
          total,
          pagesCount,
          currentPage,
          pages,
        },
        data: movies,
      });

    } catch (error) {
      return res.status(error.status || 500).json({
        ok: false,
        status: error.status || 500,
        error: error.message || "Disculpe, hay un error",
      });
    }
  },
  detail: async (req, res) => {
    try {
      const movie = await getMovieById(req.params.id);

      return res.status(200).json({
        ok: true,
        data: movie,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        ok: false,
        status: error.status || 500,
        error: error.message || "Disculpe, hay un error",
      });
    }
  },
  create: async (req, res) => {
    try {

      const { title, release_date, awards, rating, length, genre_id, actors } = req.body;


      if ([title, release_date, awards, rating].includes('' || undefined)) {
        throw createError(400, 'Los datos "title", "release_date", "awards", "rating" son OBLIGATORIOS')
      }

      const newMovie = await createMovie({
        title,
        rating,
        awards,
        release_date,
        length,
        genre_id
      },
        actors
      );

      return res.status(200).json({
        ok: true,
        msg: 'Película creada exitosamente',
        url: `${req.protocol}://${req.get('host')}/api/v1/movies/${newMovie.id}`,
        data: newMovie
      });

    } catch (error) {
      return res.status(error.status || 500).json({
        ok: false,
        status: error.status || 500,
        error: error.message || "Disculpe, hay un error",
      });
    }

  },
  update: async (req, res) => {

    try {

      const movieUpdated = await updateMovie(req.params.id, req.body);

      return res.status(200).json({
        ok: true,
        msg: 'Película actualizada exitosamente',
        url: `${req.protocol}://${req.get('host')}/api/v1/movies/${movieUpdated.id
          }`,
        data: movie
      });

    } catch (error) {
      return res.status(error.status || 500).json({
        ok: false,
        status: error.status || 500,
        error: error.message || "Disculpe, hay un error",
      });
    }

  },

  destroy: async (req, res) => {
    try {

      const movieUpdate = await deleteMovie(req.params.id, req.body);


      return res.status(200).json({
        ok: true,
        msg: 'Película eliminada exitosamente',
      });

    } catch (error) {
      return res.status(error.status || 500).json({
        ok: false,
        status: error.status || 500,
        error: error.message || "Disculpe, hay un error",
      });

    }
  }
};

module.exports = moviesController;