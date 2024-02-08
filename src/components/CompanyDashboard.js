import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

export default function Dashboard() {
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState(''); // State to store the company name
  const [companyId, setCompanyId] = useState(''); // State to store the company ID
  const [location, setLocation] = useState(''); // State to store the location
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('uid', '==', currentUser.uid));

      try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          setName(doc.data().name);
          setCompanyName(doc.data().companyName || ''); // Ensure companyName is set to an empty string if undefined
          setCompanyId(doc.data().companyId || ''); // Ensure companyId is set to an empty string if undefined
          setLocation(doc.data().location || ''); // Ensure location is set to an empty string if undefined
        });
      } catch (error) {
        setError('Failed to fetch user data');
      }
    }

    fetchUserData();
  }, [currentUser.uid]);

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to logout');
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong> {currentUser.email}
          <br />
          
          {companyName && (
  <>
    <strong>Company Name: </strong> {companyName} <br />
  </>
)}
{companyId && (
  <>
    <strong>Company ID: </strong> {companyId} <br />
  </>
)}
{location && (
  <>
    <strong>Location: </strong> {location} <br />
  </>
)}
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  );
}
