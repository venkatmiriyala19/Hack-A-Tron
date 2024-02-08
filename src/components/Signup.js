import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const nameRef = useRef();
  const userTypeRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [additionalFieldsVisible, setAdditionalFieldsVisible] = useState(false); // State to manage additional fields visibility
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);

      const { user } = await signup(emailRef.current.value, passwordRef.current.value);

      const db = getFirestore();
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: nameRef.current.value,
        email: emailRef.current.value,
        userType: userTypeRef.current.value,
      });

      if (userTypeRef.current.value === 'Company') {
        navigate('/company-dashboard');
      } else if (userTypeRef.current.value === 'Freelancer') {
        navigate('/freelancer-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Failed to create an account');
    }

    setLoading(false);
  }

  // Function to toggle additional fields visibility
  const handleUserTypeChange = () => {
    setAdditionalFieldsVisible(userTypeRef.current.value !== ''); // Set visibility based on user type
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Sign Up</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" ref={nameRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="userType">
              <Form.Label>User Type</Form.Label>
              <Form.Control as="select" ref={userTypeRef} onChange={handleUserTypeChange} required>
                <option value="">Select</option>
                <option value="Company">Company</option>
                <option value="Freelancer">Freelancer</option>
              </Form.Control>
            </Form.Group>
            {additionalFieldsVisible && (
              <>
                {/* Additional fields for Company */}
                {userTypeRef.current.value === 'Company' && (
                  <Form.Group id="companyField">
                    <Form.Label>Company Field</Form.Label>
                    <Form.Control type="text" required />
                  </Form.Group>
                )}

                {/* Additional fields for Freelancer */}
                {userTypeRef.current.value === 'Freelancer' && (
                  <Form.Group id="freelancerField">
                    <Form.Label>Freelancer Field</Form.Label>
                    <Form.Control type="text" required />
                  </Form.Group>
                )}
              </>
            )}
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <br />
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </>
  );
}
