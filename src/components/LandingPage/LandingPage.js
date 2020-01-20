import React from 'react';
import { Link } from 'react-router-dom';
import skyscraper from '../../images/skyscraper.svg';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <section className="LandingPage">
      <img src={skyscraper} alt="skyscraper" />
      <h1>
        <div className="LandingPage__hero_text">
          <span className="LandingPage__t1">Dream Bigger,</span>
          <span className="LandingPage__t2">Build Faster,</span>
          <span className="LandingPage__t3">Work Less.</span>
        </div>
      </h1>
      <Link className="LandingPage__btn" to="/register">
        Register Now!
      </Link>
    </section>
  );
}
