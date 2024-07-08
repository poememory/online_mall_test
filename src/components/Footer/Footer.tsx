import { Avatar, Watermark } from "antd"
import './index.css'

function Footer(){
    return(
        <Watermark content="By 全员鄂人">
            <div className="footer" style={{width:'100vw',height:'200px',backgroundColor:'#666666'}}>
                <div className="avatarGroup">
                        <span>contributers:</span>
                        <Avatar.Group >
                            <Avatar alt="王" src="" />
                            <Avatar alt="王" src="" />
                            <Avatar alt="王" src="" />
                            <Avatar alt="龚" src="" />
                            <Avatar alt="张" src="" />
                        </Avatar.Group>
                </div>
            </div>
        </Watermark>
    )
}

export default Footer