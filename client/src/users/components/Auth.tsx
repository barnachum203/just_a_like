import { FC } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { fetchExpertise } from '../store/user.actions';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

const Auth:FC = () => {
    const dispatch = useDispatch();
    const { expertises } = useSelector((state: any) => state.userModule)

    const googleAuthSuccess = (response:any) => {
        console.log(response);
        axios.post('http://localhost:8000/user/google-login', {tokenId: response.tokenId})
    }

    const googleAuthFailure = (response:any) => {
        console.log(response);
    }

    const facebookAuthSuccess = (response:any) => {
        console.log(response);
        axios.post('http://localhost:8000/user/facebook-login', { accessToken: response.accessToken, userID: response.userID })
    }

    const fetchAllExpertise = () => {
        dispatch(fetchExpertise());
    }
    
    return (
        <div className="login-page">
            <h1>Google Login</h1>
            <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID ?? ''}
            buttonText={'Login with Google'}
            onSuccess={googleAuthSuccess}
            onFailure={googleAuthFailure}
            cookiePolicy={'single_host_origin'}/>
            <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_AUTH_APP_ID ?? ''}
            autoLoad={false}
            callback={facebookAuthSuccess}/>
            <button onClick={fetchAllExpertise}>fetch</button>
            {
               expertises.map((exp: any) => (
                    <p key={exp._id}>{exp.name}</p>
                ))
            }
        </div>
    )
}

export default Auth;