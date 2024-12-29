import React from 'react';

const SavedPlaces = ({ places, onPlaceSelect }) => {
  return (
    <div className="form-section">
      <h2 className="form-section-title">Saved Places</h2>
      <div className="saved-places">
        {places.map(place => (
          <div
            key={place.id}
            className="saved-place-card"
            onClick={() => onPlaceSelect(place)}
          >
            <i className={`bi ${place.icon} saved-place-icon`}></i>
            <div className="saved-place-name">{place.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPlaces; 