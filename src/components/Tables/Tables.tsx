import React, { useEffect, useRef, useState, ReactNode } from 'react';
import Phone_price_Table from './components/phone_price';
import './index.css';
import Laptop_market from './components/laptop_market';

interface FadeInSectionProps {
    children: ReactNode;
  }


  const FadeInSection: React.FC<FadeInSectionProps> = ({ children }) => {
  const domRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    });
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
      ref={domRef}
    >
      {children}
    </div>
  );
};

const Tables: React.FC = () => {
  return (
    <div className="Tables_page ">
      <FadeInSection>
        <Phone_price_Table></Phone_price_Table>
      </FadeInSection>
      <FadeInSection>
        <Laptop_market></Laptop_market>
      </FadeInSection>
      <FadeInSection>
        <h1>Fade In Section 3</h1>
        <p>This content will fade in as you scroll down.</p>
      </FadeInSection>
      <FadeInSection>
        <h1>Fade In Section 3</h1>
        <p>This content will fade in as you scroll down.</p>
      </FadeInSection>


    </div>
  );
};

export default Tables;
