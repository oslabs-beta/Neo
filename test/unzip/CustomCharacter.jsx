import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class CustomCharacter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
    };

    this.saveNickname = this.saveNickname.bind(this);
    this.handleNicknameInput = this.handleNicknameInput.bind(this);
  }

  componentDidMount() {
    const charId = this.props.match.params.id;
    const character = this.props.characters[charId] || {};
    const nickname = character.nickname || '';
    return this.setState({ nickname });
  }

  saveNickname() {
    const charId = this.props.match.params.id;
    const character = { ...this.props.characters[charId] } || {};
    character.nickname = this.state.nickname;
    this.props.updateCharacter(charId, character);
  }

  handleNicknameInput(e) {
    const { value } = e.target;
    this.setState({ nickname: value });
  }

  render() {
    const charId = this.props.match.params.id;
    const character = this.props.characters[charId] || {};

    if (!character.id) return (
      <div>Sorry, no character found</div>
    );

    return (
      <section className="customCharContainer">
        <Link to="/">
          <button type="button" className="secondaryButton">
            Back to all characters
          </button>
        </Link>
        <article className="customizeChar">
          <h3>{character.name}</h3>
          {character.nickname
            && <p>Current Nickname: {character.nickname}</p>
          }
          <div className="nicknameFields">
            <label htmlFor="nickname">Give this character a nickname:</label>
            <input name="nickname" placeholder="Kewl Dood" value={this.state.nickname} onChange={this.handleNicknameInput} />
          </div>
          <button
            type="button"
            className="primaryButton customCharNickname"
            onClick={this.saveNickname}
          >
            Save Nickname
          </button>
        </article>
      </section>
    );
  }
}

export default withRouter(CustomCharacter);
