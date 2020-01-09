import React from 'react';
import skyscraper from '../../images/skyscraper.svg';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="LandingPage">
      <img src={skyscraper} alt="skyscraper" />
      <h2>
        <div className="LandingPage__hero_text">
          <span>Dream Bigger</span>
          <span>Build Faster</span>
        </div>
      </h2>
      <button>Register Now!</button>
    </div>
  );
}
