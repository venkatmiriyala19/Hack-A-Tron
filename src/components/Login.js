import React, { useRef, useState,useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './Backgrounds.css';
import './Login.css';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.body.className = 'login';
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      await login(emailRef.current.value, passwordRef.current.value);

      // Fetch user data to determine user type
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', emailRef.current.value));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userType = doc.data().userType;

        // Redirect based on user type
        if (userType === 'Company') {
          navigate('/company-dashboard');
        } else if (userType === 'Freelancer') {
          navigate('/freelancer-dashboard');
        } else {
          // Default redirect or handle other cases
          navigate('/');
        }
      });
    } catch (error) {
      setError('Failed to log in');
    }

    setLoading(false);
  }

  return (
    <>
      <Card className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)',color:'#2f102c', 
      height: '370px', 
      width: '400px',
      borderRadius:'26px'
       }}>
        <Card.Body className='card-body' >
          <h2 className='text-center mb-4'>Login</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} style={{marginTop:'20px'}} >
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required className='input' style={{backgroundColor:'rgba(255,255,255,0.5)',color:'#2f102c'}}/>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required style={{backgroundColor:'rgba(255,255,255,0.7)'}} />
            </Form.Group>
            <br />
            <Button disabled={loading} className="w-100" type="submit" style={{backgroundColor:'#2f102c',border:'0',fontSize:'16px' }}>
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2" style={{ color:'#fad4bb' }}>
        Need an account? <Link to="/signup" className='a' style={{ textDecoration: 'none'}}>Sign Up</Link>
      </div>
    </>
  );
}
