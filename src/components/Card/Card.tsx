import React from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;


const Card_product: React.FC = ({ name, price, image ,P_ID }) => {
  const nav=useNavigate()
  return (
  <Card
    hoverable
    style={{ width: 320 }}
    cover={<img alt="example"src={image} style={{width:'320px',height:'320px'}}/>}
    onClick={()=>{nav(`/product_detail/${P_ID}`)}}
  >
    <Meta title={name} description={`￥${price}`} />
  </Card>
);
}

export default Card_product;