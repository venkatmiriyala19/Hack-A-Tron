import React, { useRef, useState,useEffect} from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import './Signup.css';
export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const nameRef = useRef();
  const userTypeRef = useRef();
  const companyNameRef = useRef();
  const locationRef = useRef(); // New ref for the Location field
  const workingExperienceRef = useRef(); // New ref for the Working Experience field
  const companyIdRef = useRef(); // Ref for the company ID input field
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [additionalFieldsVisible, setAdditionalFieldsVisible] = useState(false);
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const linkStyle={
    textDecoration: 'none',color: isHovered ? 'aliceblue' : '#435a91',
  }


  useEffect(() => {
    document.body.className = 'Signup';
  }, []);

  const handleUserTypeChange = () => {
    setAdditionalFieldsVisible(userTypeRef.current.value !== '');
  };

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

      if (userTypeRef.current.value === 'Company') {
        const companyIdValue = companyIdRef.current.value;

        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          email: emailRef.current.value,
          userType: userTypeRef.current.value,
          companyName: companyNameRef.current.value,
          location: locationRef.current.value, // Add Location field
          companyId: companyIdValue,
        });

        setCompanyId(companyIdValue);
        navigate('/login-successfull');
      } else if (userTypeRef.current.value === 'Freelancer') {
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          name: nameRef.current.value,
          email: emailRef.current.value,
          userType: userTypeRef.current.value,
          workingExperience: workingExperienceRef.current.value, // Add Working Experience field
        });

        navigate('/login-successfull');
      } else {
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          name: nameRef.current.value,
          email: emailRef.current.value,
          userType: userTypeRef.current.value,
        });

        navigate('/');
      }
    } catch (error) {
      setError('Failed to create an account');
    }

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
    }

    setLoading(false);
  }

  return (
    <>
      <Card style={{ backgroundColor: 'rgba(255, 255, 255,0.2)',boxShadow: '1px 16px 186px -44px rgba(0,0,0,0.7)', borderRadius:'26px',color:"#162734"}}>
        <Card.Body>
          <h2 className='text-center mb-2'>Sign Up</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} >
            <Form.Group id="email" style={{marginBottom:"15px"}}>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required style={{backgroundColor:'rgba(255,255,255,0.7)',color:"#162734"}}  />
            </Form.Group>
            
            <Form.Group id="userType"  style={{marginBottom:"15px"}}>
              <Form.Label>User Type</Form.Label>
              <Form.Control as="select" ref={userTypeRef} onChange={handleUserTypeChange} required style={{backgroundColor:'rgba(255,255,255,0.7)',color:"#162734"}}>
                <option value="">Select</option>
                <option value="Company">Company</option>
                <option value="Freelancer">Freelancer</option>
              </Form.Control>
            </Form.Group>
            {additionalFieldsVisible && (
              <>
                {userTypeRef.current.value === 'Company' && (
                  <>
                    <Form.Group id="companyName"  style={{marginBottom:"15px"}}>
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        ref={companyNameRef}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        style={{backgroundColor:'rgba(255,255,255,0.7)',color:"#162734"}}
                      />
                    </Form.Group>
                    <Form.Group id="location"  style={{marginBottom:"15px"}}>
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        ref={locationRef}
                        // Add onChange if needed
                        required
                        style={{backgroundColor:'rgba(255,255,255,0.7)',color:"#162734"}}
                      />
                    </Form.Group>
                    <Form.Group id="companyId"  style={{marginBottom:"15px"}}>
                      <Form.Label>Company ID</Form.Label>
                      <Form.Control
                        type="text"
                        ref={companyIdRef}
                        onChange={(e) => setCompanyId(e.target.value)}
                        required
                        style={{backgroundColor:'rgba(255,255,255,0.7)',color:"#162734"}}
                      />
                    </Form.Group>
                  </>
                )}

                {userTypeRef.current.value === 'Freelancer' && (
                  <>
                    <Form.Group id="name"  style={{marginBottom:"15px"}}>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control type="text" ref={nameRef} required style={{backgroundColor:'rgba(255,255,255,0.7)',color:"#162734"}} />
                    </Form.Group>
                    <Form.Group id="workingExperience"  style={{marginBottom:"15px"}}>
                      <Form.Label>Working Experience</Form.Label>
                      <Form.Control
                        type="text"
                        ref={workingExperienceRef}
                        // Add onChange if needed
                        required
                        style={{backgroundColor:'rgba(255,255,255,0.7)',color:"#162734"}}
                      />
                    </Form.Group>
                  </>
                )}
              </>
            )}
            <Form.Group id="password"  style={{marginBottom:"15px"}}>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required style={{backgroundColor:'rgba(255,255,255,0.7)',color:"#162734"}} />
            </Form.Group>
            <Form.Group id="password-confirm"  style={{marginBottom:"15px"}}>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required style={{backgroundColor:'rgba(255,255,255,0.7)',color:"#162734"}}/>
            </Form.Group>

            <Form.Group controlId="termsCheckbox" className='mt-2 mb-2'  style={{marginBottom:"15px"}}>
              <Form.Check
                type="checkbox"
                label="I accept the terms and conditions"
                onChange={() => setTermsAccepted(!termsAccepted)}
                required
                style={{color:"#162734"}}
              />
            </Form.Group>

            <Button disabled={loading} className="w-100" type="submit" style={{backgroundColor:'#162734', border:'0',color:'#fff4fd'}}>
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2" style={{color:'rgba(0,2,35,255)'}}>
        Already have an account? <Link to="https://hire-a-hand.vercel.app/"  style={linkStyle}  onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}>Login</Link>
      </div>
    </>
  );
}
