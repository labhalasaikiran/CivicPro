import React from 'react';
const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home-overlay">
        <div className="home-container">
          <h1 className="home-title">Welcome to CivicConnect</h1>

          <p className="home-intro">
            CivicConnect is a smart community engagement platform designed to strengthen the relationship between civilians and authorities.
            Whether you're a resident or an authority member, our app helps streamline communication, promote civic responsibility, and ensure a transparent environment.
          </p>

          <div className="home-feature-grid">
            <div className="home-card">
              <h2 className="home-card-title">👤 Features for Civilians</h2>
              <ul>
                <li>✅ Post Good Deeds</li>
                <li>📝 Submit Complaints</li>
                <li>📢 View Announcements</li>
                <li>🧾 Manage Your Profile</li>
              </ul>
            </div>

            <div className="home-card">
              <h2 className="home-card-title">🛡️ Features for Authorities</h2>
              <ul>
                <li>✅ All Civilian Features</li>
                <li>🚫 Report Individuals</li>
                <li>📂 Post Bad Deeds to User Dashboards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
