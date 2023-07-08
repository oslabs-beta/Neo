import React, { Component } from 'react';
import CharacterCard from './CharacterCard';

class Characters extends Component {
  constructor(props) {
    super(props);

    this.getDetails = this.getDetails.bind(this);
    this.favClicked = this.favClicked.bind(this);
  }

  getDetails(character) {
    fetch('/api/info', {
      method: 'POST',
      body: JSON.stringify({ character }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then((data) => {
        const updatedCharacter = { ...character };
        updatedCharacter.moreInfo = {};
        updatedCharacter.moreInfo.homeworld = data.homeworld;
        updatedCharacter.moreInfo.films = data.films;
        this.props.updateCharacter(character.id, updatedCharacter);
      })
      .catch(err => console.log('getDetails: ERROR: ', err));
  }

  favClicked(charId) {
    const character = { ...this.props.characters[charId] };
    if (!character.fav) character.fav = true;
    else character.fav = false;
    this.props.updateCharacter(charId, character);
  }

  render() {
    const { characterIds, characters } = this.props;
    if (!characterIds) return null;

    if (!characterIds.length) return (
      <div>Sorry, no characters found</div>
    );

    const charElems = characterIds.map((id, i) => {
      const char = characters[id];
      return (
        <CharacterCard
          key={i}
          info={char}
          getDetails={this.getDetails}
          favClicked={this.favClicked}
        />
      );
    });

    return (
      <section className="mainSection">
        <header className="pageHeader">
          <h2>Characters</h2>
        </header>
        <div className="charContainer">
          {charElems}
        </div>
      </section>
    );
  }
}

export default Characters;
