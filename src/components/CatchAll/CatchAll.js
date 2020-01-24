import React from 'react'
import skyscraper from '../../images/skyscraper.svg'
import './CatchAll.css'

export const CatchAll = () => {
  return (
    <div className="LandingPage CatchAll">
      <img src={skyscraper} alt="skyscraper" />
      <h3 className="CatchAll__h3">Ruh Roh</h3>
      <span className="CatchAll__span">
        What you're looking for doesn't exist.
      </span>
    </div>
  )
}
