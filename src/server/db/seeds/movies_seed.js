exports.seed = knex =>
  knex('movies')
    .del()
    .then(() =>
      knex('movies').insert({
        name: 'The Land Before Time',
        genre: 'Fantasy',
        rating: 7,
        explicit: false,
      })
    )
    .then(() =>
      knex('movies').insert({
        name: 'Jurassic Park',
        genre: 'Science Fiction',
        rating: 9,
        explicit: true,
      })
    )
    .then(() =>
      knex('movies').insert({
        name: 'Ice Age: Dawn of the Dinosaurs',
        genre: 'Action/Romance',
        rating: 5,
        explicit: false,
      })
    );
