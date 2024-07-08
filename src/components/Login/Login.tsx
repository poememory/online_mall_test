import { useEffect, useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button,Form, Input, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import fetchApi from '../../utils/fetch';
import './index.css'
import { Watermark } from 'antd/lib';

export default function Login(){
    const nav=useNavigate()
    const [mode,setMode]=useState('登陆')
    const [Movemode,setMovemode]=useState('')
    function handleclick(data:string){
        if(data==mode) return
        else{
            setMode(data)
            setMovemode(data=='注册'?'goleft':'goright')
        }
    }
    function LoginPart(){
        const onFinish = (values: any) => {
            fetchApi({
                method:'POST',
                url:'/login',
                content:values
            })
            .then(data =>{
                if(data.token){
                    message.info('登陆成功')
                localStorage.setItem('token',data.token)
                nav('/')
            }                       
        })
            .catch(error => {message.info('登录失败');console.error('Error:', error)});
          };
        
        return(
            <div className="inner_content">
                 <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                         size='large'
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                        </Button>
                        Or <a onClick={()=>handleclick('注册')}>register now!</a>
                    </Form.Item>
                    </Form>
            </div>
        )
    }
    const [form] = Form.useForm(); 
    function RegisterPart(){
        const onFinish = (values: any) => {
            console.log(values);
            delete values.confirm
            fetchApi({
                url:'/register',
                method:'POST',
                content:values
            }).then(data=>message.info(data.message))
          };
        function get_verify_code(): void {
            const email=form.getFieldValue('email');        
            fetchApi({
                url:'/get_verification_code',
                method:'POST',
                content:{email:email}
            }).then(data=>console.log(data)
            )
        }

        return(
            <div className="inner_content">
                <Form
                    name="register"
                    className="register-form"
                    initialValues={{ remember: true }}
                    form={form}
                    onFinish={onFinish}
                    >
                    <Form.Item
                        name="email"
                        label="邮 箱"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                        ]}
                    >
                        <Input/>
                        
                    </Form.Item>
                    <div style={{display:'flex'}}>
                    <Form.Item
                        name="verification_code"
                        label="验证码"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your verifiy_code!',
                        },
                        ]}
                        hasFeedback
                    >
                        <Input className='verify_code_input' />
                    </Form.Item>
                    <Button style={{marginLeft:'20px'}} onClick={get_verify_code}>获取验证码</Button>
                    </div>
                    <Form.Item
                        name="password"
                        label="密 码"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="确 认"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>       
                    <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
      </Form.Item> 
                </Form>
            </div>
        )
    }
    return(
        <Watermark content='By 全员鄂人'>
            <div className='LoginPage'>
                            <div className='breathIcon gameBar'></div>
                            <div className='breathIcon earwears'></div>
                <div className="contentbox">
                    <div className="title">
                        <div className={`backtap ${Movemode}`}></div>
                        <div className={`titlecontent ${mode=="登陆"?'':'unselect'}`} onClick={()=>handleclick('登陆')}>登陆</div>
                        <div className={`titlecontent ${mode=="注册"?'':'unselect'}`} onClick={()=>handleclick('注册')}>注册</div>
                    </div>
                    {mode=="登陆"?<LoginPart/>:<RegisterPart/>}
                </div>
            </div>
        </Watermark>
    )
}

