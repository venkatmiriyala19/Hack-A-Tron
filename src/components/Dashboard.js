import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import './Backgrounds.css';

export default function Dashboard() {
  const [error, setError] = useState('');
  const [name, setName] = useState(''); // State to store the user's name
  const { currentUser, logout } = useAuth();
  const [workingExperience, setWorkingExperience] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = 'dashboard';
    async function fetchUserName() {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('uid', '==', currentUser.uid));

      try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          setName(doc.data().name);
          setWorkingExperience(doc.data().workingExperience || '');
        });
      } catch (error) {
        setError('Failed to fetch user data');
      }
    }

    fetchUserName();
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
          <strong>Name: </strong> {name}
          <br />
          {workingExperience && (
  <>
    <strong>Working Experience: </strong> {workingExperience} <br />
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
