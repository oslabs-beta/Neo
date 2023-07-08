import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Characters from './components/Characters';
import CustomCharacter from './components/CustomCharacter';
import './stylesheets/styles.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characterIds: [],
      fetchedChars: false,
      charactersById: {},
    };

    this.addCharacters = this.addCharacters.bind(this);
    this.updateCharacter = this.updateCharacter.bind(this);
  }

  componentDidMount() {
    fetch('/api/characters')
      .then(res => res.json())
      .then(res => this.addCharacters(res.characters))
      .catch(err => console.log('App.componentDidMount: get characters: ERROR: ', err));
  }

  addCharacters(characters) {
    const charactersById = JSON.parse(JSON.stringify(this.state.charactersById));
    const characterIds = [...this.state.characterIds];
    characters.forEach((char) => {
      const splitURL = char.url.split('/').filter(el => el);
      const id = splitURL[splitURL.length - 1];
      // eslint-disable-next-line no-param-reassign
      char.id = id;
      if (!charactersById[id]) {
        characterIds.push(id);
        charactersById[id] = char;
      }
    });
    this.setState({ characterIds, charactersById, fetchedChars: true });
    return true;
  }

  updateCharacter(id, character) {
    const charactersById = JSON.parse(JSON.stringify(this.state.charactersById));
    charactersById[id] = character;
    this.setState({ charactersById });
    return true;
  }

  render() {
    if (!this.state.fetchedChars) return null;
    const pageProps = {
      characters: this.state.charactersById,
      characterIds: this.state.characterIds,
      addCharacters: this.addCharacters,
      updateCharacter: this.updateCharacter,
    };
    return (
      <div className="router">
        <main>
          <Switch>
            <Route exact path="/"
              component={
                () => <Characters {...pageProps} />
              }
            />
            <Route exact path="/customize/:id"
              component={
                () => <CustomCharacter {...pageProps} />
              }
            />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
