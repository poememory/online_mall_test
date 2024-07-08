import { Button, Input, Radio, Watermark } from "antd";
import './index.css'
import { useEffect, useState } from "react";
import fetchApi from "../../utils/fetch";
import { useNavigate } from "react-router-dom";

export default function Profile(){
    const nav=useNavigate()
    const [nickName,setNickName]=useState('')
    const [gender,setGender]=useState('')
    const [detail,setDetail]=useState('')
    const [email,setEmial]=useState('')
    const [phone,setPhone]=useState('')
    const { TextArea } = Input;
    useEffect(()=>{
        fetchApi({
            method:'GET',
            url:'/profile',
        }).then(data=>{
            setNickName(data.name)
            setEmial(data.email)
            setGender(data.gender)
            setDetail(data.detail)
            setPhone(data.phone)
        })
    },[])
    function handleSubmit(){
        fetchApi({
            method:'POST',
            url:'/profile/update',
            content: {
                'email': email,
                'gender': gender,
                'phone': phone,
                'detail':detail,
                'name':nickName
            }
        })
    }
    function logout(){
        localStorage.setItem('token','')
        nav('/login')
    }
    return(
        <>
        <Watermark className="back_waterMark" content='By 全员鄂人'></Watermark>
        <div className="profilebox">
            <div className="profile_avatar"></div>
            <div className="profile_item"><div>姓名:</div><Input value={nickName} onChange={(e)=>setNickName(e.target.value)}></Input></div>
            <div className="profile_item">
                <div>性别:</div>
                <Radio.Group value={gender} onChange={(e)=>setGender(e.target.value)}>
                    <Radio value={'男'}>男</Radio>
                    <Radio value={'女'}>女</Radio>
                </Radio.Group>
            </div>
            <div className="profile_item"><div>邮箱:</div><Input disabled value={email}></Input></div>
            <div className="profile_item"><div>手机:</div><Input value={phone} onChange={(e)=>setPhone(e.target.value)}></Input></div>
            <div className="profile_item"><div>个人签名:</div><TextArea value={detail} onChange={(e)=>setDetail(e.target.value)} style={{width:'600px',height:'130px',resize:'none'}}></TextArea></div>
            <Button onClick={handleSubmit} style={{marginLeft:'30vw'}}>提交修改</Button>
            <Button onClick={logout} style={{marginLeft:'60vw'}}>退出登陆</Button>
        </div>
        </>
    )
}