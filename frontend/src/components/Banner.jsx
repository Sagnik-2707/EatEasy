import React from "react";
import "../Banner.css"; // import external CSS

const Banner = () => {
  return (
    <section className="banner">
      <div className="banner-container">
        {/* Left Side */}
        <div className="banner-content">
          <h1>
            Hungry? <span className="highlight">Let’s Deliver</span> Happiness
            <br /> to Your <span className="highlight">Doorstep!</span>
          </h1>
          <p>
            Explore flavors from the best restaurants in your city. Whether it’s your
            favorite comfort food or something new, we’ve got you covered with quick
            and easy delivery.
          </p>
        </div>
          
        <div className="banner-image">
          <img src="/banner-img.png" alt="Delicious food" />
        </div>
      </div>
    </section>
  );
};

export default Banner;
