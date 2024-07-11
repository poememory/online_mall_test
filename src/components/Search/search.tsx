import { useEffect, useState } from "react"
import fetchApi from "../../utils/fetch"
import Card from "../Card/Card";
import { Divider } from "antd";
import { useParams } from "react-router-dom";


interface homeDetailKind{
    Name:string;
    Price:number;
    Image_URL:string;
    P_ID:number
  }
export default function Search(){
    const [homeState,setHomeState]=useState<homeDetailKind[]>()
    const {key}=useParams()
    useEffect(()=>{
        const getCart = async () => {
            try {
                const searchData = await fetchApi({
                    url: `/search?query=${key}`,
                    method: "GET",
                });
                if(searchData){console.log(searchData);setHomeState(searchData)}
                
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };
        
        getCart();
        
    },[key])
    useEffect(()=>{
        console.log(homeState);
        
    },[homeState])
    return(
        <div className="cartPage">
             <Divider style={{marginTop:'30px',position:'absolute',top:'40px'}} orientation="left">为您搜素到有关{key}的相关内容</Divider>
            <div className="cards_Home">
                {homeState?.map((item,index)=>{
                return(
                    <Card key={index} name={item.Name} price={item.Price} image={item.Image_URL} P_ID={item.P_ID}></Card>
                )
                })}
            </div>
        </div>
    )
}