import React, { useState } from 'react';
import Phone_price_Table from './components/phone_price';
import './index.css';
import Laptop_market from './components/laptop_market';
import Displayer_3d from './components/displayer_3d';



const Tables: React.FC = () => {
  const [onshowNum,setOnshowNum]=useState(1)
  return (
    <div className="Tables_page " onClick={()=>{if(onshowNum!=3){setOnshowNum(pre=>pre+1)}}}>
        {onshowNum==1&&<Phone_price_Table></Phone_price_Table>}
        {onshowNum==2&&<Laptop_market></Laptop_market>}
        {onshowNum==3&&<Displayer_3d></Displayer_3d>}
    </div>
  );
};

export default Tables;
