import { useEffect, useState } from "react"
import fetchApi from "../../utils/fetch"
import "./index.css"
import Card from "../Card/Card";
import { Divider } from "antd";


interface homeDetailKind{
    Name:string;
    Price:number;
    Image_URL:string;
    P_ID:number
  }
export  default function Cart(){
    const [homeState,setHomeState]=useState<homeDetailKind[]>()
    const [cartArr,setCartArr]=useState<number[]>([])
    useEffect(()=>{
        const getCart = async () => {
            const temp: homeDetailKind[] = [];
            try {
                const cartData = await fetchApi({
                    url: '/cart',
                    method: "GET",
                });
                setCartArr(cartData.cart)
                if (cartData && cartData.cart) {
                    const fetchDetailsPromises = cartData.cart.map(async (item: string, index: number) => {
                        const options = {
                            url: '/product_detail',
                            method: 'POST',
                            content: { P_ID: item }
                        };
                        const response = await fetchApi(options);
                        if (response && response.length > 0) {
                            temp[index] = response[0];
                        }
                    });
        
                    await Promise.all(fetchDetailsPromises);
                }
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        
            setHomeState(temp);
        };
        
        getCart();
        
    },[])
    return(
        <div className="cartPage">
             <Divider style={{marginTop:'30px',position:'absolute',top:'40px'}} orientation="right">您的购物车</Divider>
            <div className="cards_Home">
                {homeState?.map((item,index)=>{
                return(
                    <Card key={index} name={item.Name} price={item.Price} image={item.Image_URL} P_ID={cartArr[index]}></Card>
                )
                })}
            </div>
        </div>
    )
}