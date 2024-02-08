import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Login</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <br />
            <Button disabled={loading} className="w-100" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  );
}
