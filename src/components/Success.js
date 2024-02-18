import React,{useEffect} from 'react';
import { Link } from 'react-router-dom'; 
import './Success.css'// Make sure to have React Router installed

const SignupSuccessPage = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // Ensure the container takes at least the full viewport height
  };
  useEffect(() => {
    document.body.className = 'Signup';
  }, []);
  return (
    <div style={containerStyle} className='Suc'>
      <h1>Signup Successful</h1>
      <p>Your account has been successfully created!</p>
      <p>
        Please go back to <Link to="https://hire-a-hand.vercel.app/" style={{textDecoration:'none',color:'rgb(157, 133, 252)'}}>Home Page</Link> and login again
      </p>
    </div>
  );
};

export default SignupSuccessPage;
