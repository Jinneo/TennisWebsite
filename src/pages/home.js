import { useNavigate } from "react-router-dom";
import {ReactComponent as Tennissvg} from '/Users/pvadlamani/Downloads/SnWeb/snweb/src/pages/images/racket.svg';
import {ReactComponent as Tennisball} from '/Users/pvadlamani/Downloads/SnWeb/snweb/src/pages/images/tennisball.svg';

function Starttext(){
    const navigate = useNavigate();
    return (
      <div className = "start-container">
        <div className = "sean-big">Sean's Tennis Coaching</div>
        {/* <div className = "sean-small">Tennis Coaching</div> */}
        <button className = "start-button" 
            onClick = {()=> navigate("/schedule")}
        ><span className = "start-button-text"><strong>Get Started</strong></span></button>
      </div> 
    );
}
function Rotating() {
    return (
        <>
            <Tennissvg className = "racket"/>
            <Tennisball />
        </>
    );
}

export function Startpage() {
    return (
        <>
        <Starttext />
        <Rotating />
        </>
    );
  }