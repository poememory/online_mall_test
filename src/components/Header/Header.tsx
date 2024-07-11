import { Dropdown, Menu,} from 'antd';
import { Link  } from 'react-router-dom';
import { DownOutlined} from '@ant-design/icons'
import { useState } from 'react';
import { Space } from 'antd';
import Search, { SearchProps } from 'antd/es/input/Search';
import {useNavigate } from 'react-router-dom';


function Header(){
    const nav=useNavigate()
const token=localStorage.getItem('token')
const products = {
    phone: '手机',
    laptop: '笔记本',
    tablet: '平板电脑',
    camera: '相机',
    displayer: '显示器',
    earwears: '耳机',
    mouse: '鼠标',
    keyboard: '键盘',
  };
  
  // 遍历 products 对象并生成 items 数组
  const items = Object.entries(products).map(([key, value], index) => ({
    key: index.toString(),
    label: (
      <a target='_self' href={`/productKind/${key}`} rel="noopener noreferrer">
        {value}
      </a>
    ),
  }))
  const onSearch: SearchProps['onSearch'] = (value) => {nav(`/search/${value}`)}
    return(
        <Menu theme='dark' mode="horizontal" defaultSelectedKeys={['1']} 
            style={{width:'100vw',
                    height:'50px',
                    position:'fixed',
                    top:'0',
                    zIndex:'100',
                    boxShadow:'0 0 2px 2px black'}}>
            <Menu.Item key="1" style={{position:'absolute',left:'100px',backgroundColor:'transparent'}}>
                <Link to="/">
                <div style={{width:'80px',height:'45px',backgroundImage: 'url(/icon.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat',backgroundColor: 'transparent' }}></div>
                </Link>
            </Menu.Item>
            <div style={{position:'absolute',left:'200px'}}>
            <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                <Space style={{color:"#ffff"}}>
                    分类
                    <DownOutlined />
                </Space>
                </a>
            </Dropdown>
            </div>
            <Menu.Item key="1" style={{position:'absolute',left:'300px',backgroundColor:'transparent'}}>
                <Link to="/tables">
                    视图
                </Link>
            </Menu.Item>
            <Menu.Item key="10086" style={{position:'absolute',left:'400px',backgroundColor:'transparent'}}>
            <Search
                style={{marginTop:"10px"}}
                placeholder="搜你想要"
                onSearch={onSearch}
                />
            </Menu.Item>
            <div style={{position:'absolute',right:'120px',width:'150px'}}>
                <Link to={token?'/profile':'/login'}>
                    <div style={{backgroundImage:`url(${token?'/user-default-avatar.jpg':'/user-default-avatar.jpg'})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat',width:'33px',height:'33px',borderRadius:'33px',marginTop:'5px',position:'absolute',left:'0'}}/>
                    <div style={{position:'absolute',left:'40px'}}>{token?'个人中心':'请先登陆'}</div>
                </Link>
            </div>
            <div  style={{position:'absolute',right:'50px'}}>
                <Link  to="/cart" style={{color:'#ffff'}}>购物车</Link>
            </div>
         </Menu>
    )
}

export default Header