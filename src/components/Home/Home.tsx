import './index.css'
import Carousel from '../Carousel/Carousel';
import Card from '../Card/Card';
import { useEffect, useState } from 'react';
import fetchApi from '../../utils/fetch';
import { showIDs } from '../../content';

const CarouselArr = [
  {
  name: 'phone',
  url: '/productKind/phone',
  img: '/phone_1600x900.jpg',
  },
  {
    name: 'keyboard',
    url: '/productKind/keyboard',
    img: '/keyboard_1600x900.jpg',
  },
  {
    name: 'camera',
    url: '/productKind/camera',
    img: '/cameras_1600x900.jpg',
  },
  {
    name: 'laptop',
    url: '/productKind/laptop',
    img: '/laptop_1600x900.jpg',
  }
  ,
  {
    name: 'headphones',
    url: '/productKind?key=earwears',
    img: '/headphones_1600x900.jpg',
  }
];

interface homeDetailKind{
  Name:string;
  Price:number;
  Image_URL:string;
  P_ID:number
}

const Home = () => {
  window.scrollTo({
    top: 0,
  });
  const [homeState,setHomeState]=useState<homeDetailKind[]>()
  useEffect(()=>{
    const sendNumbers = async () => {
      const options = {
        url: '/homedetail',
        method: 'POST',
        content:showIDs
      };
      try {
        const response = await fetchApi(options);
        let processedData:homeDetailKind[] = [];
        Object.keys(response).forEach((key) => {
            response[key].forEach((item) => {
              const { Name, Price, Image_URL, P_ID } = item;
              const newData = { Name, Price, Image_URL, P_ID };
              processedData.push(newData);
            });
        });
        processedData.sort(() => Math.random() - 0.5); 
        setHomeState(processedData);
      } catch (error) {
        console.error('Error sending numbers:', error);
      }
    };
    sendNumbers()
  },[])
  return (
    <div className='Homepage'>
      <div className='Carousel_box'>
        <Carousel items={CarouselArr}></Carousel>
        <span className='Carousel_info'>
            做大做强<br/>再创辉煌<br/>广积粮<br/>缓称王
        </span>
      </div>
      <div className="cards_Home">
        {homeState?.map((item,index)=>{
          return(
            <Card key={index} name={item.Name} price={item.Price} image={item.Image_URL} P_ID={item.P_ID}></Card>
          )
        })}
      </div>
    </div>
  );
};

export default Home;
