import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import PropTypes from 'prop-types'

function Photo({ data }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [photo, setPhoto] = useState(null)
  const [rating, setRating] = useState(0)
  const [totalVotes, setTotalVotes] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    const photoData = data.find((photo) => photo.id === parseInt(id))

    if (!photoData) {
      console.error('Nie znaleziono zdjęcia')
      return
    }

    setPhoto(photoData)
    setRating(photoData.rating)
    setTotalVotes(photoData.totalVotes)
    setHasVoted(false)
  }, [id, data])

  const updateItem = (updatedData) => {
    setPhoto((prevPhoto) => ({
      ...prevPhoto,
      ...updatedData,
    }))
  }

  const handleRatingChange = (value) => {
    if (!hasVoted) {
      const newRating = (totalVotes * rating + value) / (totalVotes + 1)
      const newTotalVotes = totalVotes + 1
      setRating(newRating)
      setTotalVotes(newTotalVotes)
      setHasVoted(true)
      updateItem({ rating: newRating, totalVotes: newTotalVotes })
    }
  }

  const goToPreviousPhoto = () => {
    const previousId = parseInt(id) - 1
    navigate('/photos/' + previousId)
  }

  const goToNextPhoto = () => {
    const nextId = parseInt(id) + 1
    navigate('/photos/' + nextId)
  }

  const goToInfo = () => {
    navigate('/info/photos/' + id)
  }

  if (!photo) {
    return <div>Loading...</div>
  }

  return (
    <div className="photo">
      <img src={photo.url} alt={photo.name} className="photo" />

      <div className="navigation-buttons">
        {parseInt(id) > 1 && (
          <button onClick={goToPreviousPhoto}>Previous</button>
        )}

        {parseInt(id) < data.length && (
          <button onClick={goToNextPhoto}>Next</button>
        )}
      </div>

      <div className="photo-details">
        <p className="photo-title">Author: {photo.name}</p>
        <p className="photo-date">Date: {photo.date}</p>
        <button onClick={goToInfo}>Info</button>
        <div>
          <div>
            <p>Total votes: {totalVotes}</p>
            <p>Average: {rating.toFixed(1)}</p>
          </div>
          <div className="rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value}>
                <FaStar
                  onClick={() => handleRatingChange(value)}
                  color={value <= rating ? 'red' : 'lightgray'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

Photo.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date).isRequired,
        rating: PropTypes.number.isRequired,
        totalVotes: PropTypes.number.isRequired,
        likes: PropTypes.number.isRequired,
        dislikes: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        isFlagged: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
        symbolValue: PropTypes.symbol.isRequired
      })
    ).isRequired
  };

export default Photo
