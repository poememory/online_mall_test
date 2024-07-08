import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import fetchApi from "../../utils/fetch"
import Card from "../Card/Card"
import './index.css'
import { Divider } from "antd"

interface homeDetailKind{
    Name:string;
    price:number;
    Image_URL:string;
    P_ID:number
  }
export default function ProductKind(){
    window.scrollTo({
        top: 0,
      });
    const {kind}=useParams()
    const [page_info,setPage_info]=useState<homeDetailKind[]>()
    useEffect(()=>{
        const getKind_Detail= async ()=>{
            try{
                const response = await fetchApi({
                    url:'/productKind',
                    method:'POST',
                    content:{kind:kind}
                })
                response.sort(()=>Math.random()-0.5)
                console.log(response);
                
                setPage_info(response)
            } 
            catch (error) {
                console.error('Error:', error);
            }
        }
        getKind_Detail()
    },[])
    return(
        <div className="kind_page">
            <Divider style={{marginTop:'30px'}} orientation="right">为你推荐</Divider>
            <div className="cards_Home">
                {page_info?.map((item,index)=>{
                return(
                    <Card key={index} name={item.Name} price={item.price} image={item.Image_URL} P_ID={item.P_ID}></Card>
                )
                })}
                </div>
        </div>
    )
}