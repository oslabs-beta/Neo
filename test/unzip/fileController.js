const fs = require('fs');
const path = require('path');

const fileController = {};

fileController.getCharacters = (req, res, next) => {
  try {
    const { results } = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/characters.json'), 'UTF-8'));
    res.locals.characters = results;
    next();
  } catch (e) {
    console.log('fileController.getCharacters: ERROR: ', e);
    res.status(400).send({ err: 'Error occurred in fileController.getCharacters. Check server logs for more details.' });
  }
};

fileController.getHomeworldAndFilms = async (req, res, next) => {
  if (!req.body.character) return res.status(400).json({ err: 'server POST /info: ERROR: Invalid request body' });
  try {
    res.locals.info = { ...req.body.character };
    const characterDeets = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/characterDetails.json'), 'UTF-8'));
    if (characterDeets[req.body.character.id]) {
      res.locals.info.homeworld = characterDeets[req.body.character.id].homeworld;
      res.locals.info.films = characterDeets[req.body.character.id].films;
    } else {
      res.locals.info.homeworld = 'Unknown';
      res.locals.info.films = [{ title: 'Unknown' }];
    }
    next();
  } catch (e) {
    console.log('fileController.getHomeworldAndFilms: ERROR: ', e);
    return res.status(400).json({ err: 'fileController.getHomeworldAndFilms: ERROR: Check server logs for details' });
  }
};

module.exports = fileController;
