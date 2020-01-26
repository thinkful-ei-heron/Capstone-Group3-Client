import React from 'react';
import { Link } from 'react-router-dom';
import skyscraper from '../../images/skyscraper.svg';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <section className="LandingPage">
      <div className="LandingPage__hero_text">
        <h1>
          <span className="LandingPage__t1">Dream Bigger,</span>
          <span className="LandingPage__t2">Build Faster,</span>
          <span className="LandingPage__t3">Work Less.</span>
        </h1>
        <span className="LandingPage__blurb">
          Create, update, assign, track, and analyze your businesses projects
          securely on the cloud from any location with access to the web.
        </span>
      </div>

      <img src={skyscraper} alt="skyscraper" />
      <Link className="LandingPage__btn" to="/register">
        Register Now!
      </Link>
    </section>
  );
}
