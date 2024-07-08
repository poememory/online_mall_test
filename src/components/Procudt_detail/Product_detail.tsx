import { useParams } from 'react-router-dom';
import './index.css'
import { useEffect, useState } from 'react';
import fetchApi from '../../utils/fetch';
import { Button, Divider, Drawer, Rate } from "antd";

const flag=Math.random()<0.5
const flagarr = Array.from({ length: 3 }, () => [4.0, 4.5, 5.0][Math.floor(Math.random() * 3)]);
export default function Product_detail(){
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };
    interface origin_info{
        price:string,
        taobao_ID:number
    }
    interface product_info_{
        name:string,
        Image_url:string[],
        origin:origin_info[],
        others:string[]
    }
    const { P_ID } = useParams();
    const [product_info,setProduct_info]=useState<product_info_>()
    const [onshowImg,setOnshowImg]=useState(0)
    const [minPrice,setMinPrice]=useState(888)
    useEffect(()=>{
        window.scrollTo({
            top: 0,
          });
        const sendNumbers = async () => {
            const options = {
              url: '/product_detail',
              method: 'POST',
              content:{P_ID:P_ID} 
            };
            try {
              const response = await fetchApi(options);
              let temp: product_info_ = {
                name: '',
                Image_url: [],
                origin: [],
                others: []
            };
            let mintemp=parseFloat(response[0].Price)
            response.forEach(element => {
                temp.name=element.name
                temp.Image_url.push(element.Image_URL)
                temp.origin.push({
                    taobao_ID:element.taobao_ID,
                    price:element.Price
                })
                temp.others.push(element.x1,element.x2,element.x3)
                if(parseFloat(element.Price)<mintemp)mintemp=parseFloat(element.Price)
              });
              const uniOthers=[...new Set(temp.others)]
              temp.others=uniOthers
              setMinPrice(mintemp)
              setProduct_info(temp);
            } catch (error) {
              console.error('Error sending numbers:', error);
            }
          };
          sendNumbers()
    },[P_ID])
    useEffect(() => {
        const timer = setInterval(() => {
            setOnshowImg(prevImg => (prevImg + 1) % (product_info?.Image_url.length ?? 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [onshowImg,product_info]);
    return(
        <div className="Product_detailPage">
          <Drawer title="选购渠道" size='large' onClose={onClose} open={open}>
            {product_info?.origin.map((item,index)=>{
              return(
                <a className='drawer_inner' key={index} target='_blank' href={`https://item.taobao.com/item.htm?id=${item.taobao_ID}`}>
                  <div className="drawer_title">{product_info.name}</div>
                  <div className="drawer_price">￥{item.price}</div>
                  <Rate style={{marginLeft:'50px'}}  allowHalf value={flagarr[index]} disabled />
                  <img src={product_info.Image_url[index]} className='drawer_img' />
                </a>
              )
            })}
          </Drawer>
            <div className="Product_detail">
                <img src={product_info?.Image_url[onshowImg]} className='product_img' alt="" />
                <div className="detail_info">
                    <div className="product_name">{product_info?.name}</div>
                    <div className="product_sell">已售{flag?'500+':'1000+'}</div>
                    <div className="product_price">￥{minPrice}</div>
                    <div className="buttonbox">
                        <div className="button_product" onClick={()=>showDrawer()} style={{backgroundColor:'#71AFFF'}}>
                            <svg style={{marginRight:'10px',width:'38px',height:'20px',display:'inline-block',color:'#FFFF'}} t="1720344196326" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2583" width="200" height="200"><path d="M743.629504 457.067722H242.899664c-11.050079 0-20.007386-8.957307-20.007385-20.007385s8.957307-20.007386 20.007385-20.007386h500.72984c11.050079 0 20.007386 8.957307 20.007385 20.007386s-8.958307 20.007386-20.007385 20.007385z" p-id="2584"></path><path d="M811.906708 937.761166H160.440225c-10.071718 0-18.572856-7.486764-19.847326-17.478452L79.432322 440.403571a20.006385 20.006385 0 0 1 19.847326-22.536319h792.286465a20.005385 20.005385 0 0 1 19.738286 23.283595l-79.659405 479.879143c-1.603592 9.653564-9.952674 16.731176-19.738286 16.731176z m-633.846979-40.014771h616.886718l73.016954-439.864372H121.999035l56.060694 439.864372z" p-id="2585"></path><path d="M743.629504 457.269797c-11.050079 0-20.007386-8.957307-20.007386-20.007386 0-90.267321-23.084521-174.860548-65.001995-238.196928-40.233852-60.792441-92.889289-94.2728-148.266731-94.2728s-108.031879 33.480359-148.265731 94.2728c-41.916473 63.33638-65.001995 147.929607-65.001995 238.196928 0 11.050079-8.957307 20.007386-20.007385 20.007386s-20.007386-8.957307-20.007386-20.007386c0-98.032188 25.445393-190.46831 71.647448-260.28108 22.975481-34.715815 49.911424-62.087919 80.058553-81.355031 32.029824-20.469556 66.204439-30.848387 101.575496-30.848388 35.372057 0 69.546673 10.378831 101.575495 30.848388 30.148129 19.267112 57.084072 46.639216 80.059554 81.355031 46.203055 69.81177 71.647448 162.247892 71.647448 260.28108 0.002001 11.049079-8.956306 20.007386-20.005385 20.007386z" p-id="2586"></path><path d="M280.620588 534.150177m-23.548692 0a23.548693 23.548693 0 1 0 47.097385 0 23.548693 23.548693 0 1 0-47.097385 0Z" p-id="2587"></path><path d="M710.779378 534.150177m-23.548693 0a23.548693 23.548693 0 1 0 47.097385 0 23.548693 23.548693 0 1 0-47.097385 0Z" p-id="2588"></path></svg>
                            立即购买</div>
                        <div className="button_product" style={{backgroundColor:'#4B8DEB'}}>
                            <svg style={{marginRight:'10px',width:'30px',height:'20px',display:'inline-block',color:'#FFFF'}} t="1720344680597" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3640" width="200" height="200"><path d="M352.456912 832.032253c-35.434907 0-63.989249 28.554342-63.989249 63.989249 0 35.434907 28.554342 63.989249 63.989249 63.989249s63.989249-28.554342 63.989249-63.989249C416.446162 860.586595 387.891819 832.032253 352.456912 832.032253L352.456912 832.032253z" fill="#575B66" p-id="3641"></path><path d="M800.55367 832.032253c-35.434907 0-63.989249 28.554342-63.989249 63.989249 0 35.434907 28.554342 63.989249 63.989249 63.989249s63.989249-28.554342 63.989249-63.989249C864.54292 860.586595 835.816563 832.032253 800.55367 832.032253L800.55367 832.032253z" fill="#575B66" p-id="3642"></path><path d="M864.026877 800.037628 344.200235 800.037628c-46.099782 0-86.695112-36.466991-92.199563-83.082815l-54.356459-382.043339L166.853687 156.360826c-1.892155-15.653284-16.169326-28.382328-29.930455-28.382328L95.983874 127.978498c-17.717453 0-31.994625-14.277171-31.994625-31.994625s14.277171-31.994625 31.994625-31.994625l40.767344 0c46.615824 0 87.727196 36.466991 93.403662 83.082815l30.790526 177.86259L315.473879 708.698135c1.720141 14.793214 15.309256 27.350244 28.726356 27.350244l519.826642 0c17.717453 0 31.994625 14.277171 31.994625 31.994625S881.744331 800.037628 864.026877 800.037628z" fill="#575B66" p-id="3643"></path><path d="M384.279523 672.05913c-16.685369 0-30.618512-12.729044-31.82261-29.586427-1.376113-17.545439 11.868974-33.026709 29.586427-34.230808l434.163615-31.994625c15.997312-0.172014 29.414413-12.55703 31.134554-26.834201l50.400134-288.295649c1.204099-10.664875-1.720141-22.533848-8.084663-29.758441-4.128339-4.644381-9.288762-7.052579-15.309256-7.052579L319.946246 224.3064c-17.717453 0-31.994625-14.277171-31.994625-31.994625S302.400806 159.973123 319.946246 159.973123l554.05745 0c24.426004 0 46.959852 10.148833 63.301193 28.554342 18.749538 21.157736 27.178229 50.744163 23.565933 81.706703l-50.400134 288.467663c-5.504452 44.895683-45.927768 81.362674-92.027549 81.362674l-431.755417 31.82261C385.82765 671.887116 384.967579 672.05913 384.279523 672.05913z" fill="#575B66" p-id="3644"></path></svg>加入购物车</div>
                    </div>
                </div>
                <Divider style={{position:'absolute',top:'450px'}}></Divider>
                <Divider style={{position:'absolute',top:'455px'}}></Divider>
                <Divider style={{position:'absolute',top:'460px'}}></Divider>
                <div className='product_canshu'>
                  {product_info?.others.map((item,index)=>{
                    return(
                      <Button key={index*1086}>{item}</Button>                       
                    )
                  })}
                </div>
            </div>
        </div>
    )
}