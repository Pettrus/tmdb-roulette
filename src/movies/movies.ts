const MovieDB = require('node-themoviedb');
import { Genre } from './movie-types';

const mdb = new MovieDB(process.env.TMDB_KEY);

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomArrayPositions = () => {
  const positions: number[] = [];

  while (positions.length < 3) {
    const number = randomNumber(1, 20);

    if (!positions.includes(number)) {
      positions.push(number);
    }
  }

  return positions;
};

const getMoviesByGenre = async (genre: Genre) => {
  const randomPage = randomNumber(1, 80);
  const randomPositionOfResults = generateRandomArrayPositions();
  const datetime = new Date();

  const options = {
    query: {
      language: "en-US",
      "release_date.gte": "2005-01-01",
      "release_date.lte": datetime.toISOString().slice(0,10),
      include_adult: false,
      with_genres: genre.toString(),
      page: randomPage,
    },
  };

  const result = await mdb.discover.movie(options);
  const selectedMovies = await result?.data?.results.filter(
    (_: any, index: number) => randomPositionOfResults.includes(index)
  );

  return selectedMovies;
};

export const getMoviesRoulette = async (genres: Genre[]) => {
  return await Promise.all(
    genres.map(async (genreId) => ({
      genre: Genre[genreId],
      list: await getMoviesByGenre(genreId),
    }))
  );
};