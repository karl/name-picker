import React from 'react';

import './Carousel.css';

// This is a 5th degree polynomial that gives us a best fit curve
// based on a sampling of perspectives that keep the carousel
// at about 1000px wide.
const calcPerspective = x => {
  const a = 52520.53272813499;
  const b = -8606.491632508269;
  const c = 574.6342225406787;
  const d = -19.2031863451813;
  const e = 0.3196385333456;
  const f = -0.0021159573962;
  return Math.min(
    10000,
    Math.round(
      a +
        b * x +
        c * Math.pow(x, 2) +
        d * Math.pow(x, 3) +
        e * Math.pow(x, 4) +
        f * Math.pow(x, 5),
    ),
  );
};

const Carousel = ({ selectedIndex, revolutions, children }) => {
  const total = React.Children.count(children);
  const deg = 720 * revolutions + 360 / total * selectedIndex;
  const tz = -Math.round((240 + 10) / 2 / Math.tan(Math.PI / total));
  return (
    <div className="Carousel" style={{ perspective: calcPerspective(total) }}>
      <div
        className="CarouselInner"
        style={{ transform: `translateZ(${tz}px) rotateY(${-deg}deg)` }}
      >
        {React.Children.map(children, (child, i) => (
          <CarouselItem key={i} index={i} total={total}>
            {child}
          </CarouselItem>
        ))}
      </div>
    </div>
  );
};

const CarouselItem = ({ index, total, children }) => {
  const deg = 360 / total * index;
  const tz = Math.round((240 + 10) / 2 / Math.tan(Math.PI / total));
  return (
    <div
      className="CarouselItem"
      style={{ transform: `rotateY(${deg}deg) translateZ(${tz}px)` }}
    >
      {children}
    </div>
  );
};

export default Carousel;
