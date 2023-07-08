import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regStar } from '@fortawesome/free-regular-svg-icons';

const CharacterCard = (props) => {
  const {
    name, gender, birth_year, eye_color, hair_color,
    films, moreInfo, fav, id, nickname,
  } = props.info;

  let filmData;

  if (moreInfo) filmData = moreInfo.films.map((film, i) => (<li key={i} className="charFilm">- {film.title}</li>));

  let FavIcon;
  if (fav) FavIcon = (<span className="favIcon"><FAIcon onClick={() => props.favClicked(id)} icon={solidStar} style={{ color: '#476fc5' }} /></span>);
  else FavIcon = (<span className="favIcon"><FAIcon onClick={() => props.favClicked(id)} icon={regStar} /></span>);

  return (
    <article className="charCard">
      <div className="charHeadContainer">
        <div>
          <h2 className="charName">{nickname || name}</h2>
          {nickname && <small><em>Original Name: {name}</em></small>}
        </div>
        {FavIcon}
      </div>
      <ul className="charDetailsList">
        <li className="charDetail">Gender: {gender}</li>
        <li className="charDetail">Birth Year: {birth_year}</li>
        <li className="charDetail">Eye Color: {eye_color}</li>
        <li className="charDetail">Hair Color: {hair_color}</li>
        <li className="charDetail">Number of Films: {films.length}</li>
      </ul>
      {moreInfo
        && <div className="charAddlDetailsContainer">
          <p className="charAddlDetail"><strong>Additional Info</strong></p>
          <p className="charAddlDetail">Homeworld: {moreInfo.homeworld.name}</p>
          <p className="charAddlDetail">Films:</p>
          <ul className="charFilmsList">{filmData}</ul>
        </div>
      }
      <div className="charBtnOptions">
        {!moreInfo
          && (
            <button
              type="button"
              className="charAddlDetailsButton primaryButton"
              onClick={() => { props.getDetails(props.info); }}
            >
              Get More Info
            </button>
          )
        }
        <Link to={`/customize/${id}`}>
          <button type="button" className="charCustomizeButton secondaryButton">
            Customize Character
          </button>
        </Link>
      </div>
    </article>
  );
};

export default CharacterCard;
