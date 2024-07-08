import { useState, useEffect } from 'react';
import './Carousel.css';
import { useNavigate } from 'react-router-dom';

const CarouselItem = ({ img, url }) => {
  const nav = useNavigate();

  return (
    <div
      className="carousel-item"
      style={{ backgroundImage: `url(${img})` }}
      onClick={() => nav(url)}
    ></div>
  );
};

const Carousel = ({ items, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel" >
        <div className="inner" style={{transform:`translateX(-${currentIndex*75}vw)`,transition:'transform 0.5s'}}>
            {items.map((item,index)=>{return(
            <CarouselItem key={index} url={item.url} img={item.img}></CarouselItem>
            )})}
        </div>
    </div>
  );
};
export default Carousel


