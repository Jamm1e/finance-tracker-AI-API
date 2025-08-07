import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/useAuth';

export default function AuthForms() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);

  const { currentUser } = useAuth();

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('Registration successful! You are now logged in.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('Login successful!');
      }
    } catch (err) {
      console.error("Auth error:", err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Email already in use. Try logging in or use a different email.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        default:
          setError('Authentication failed. Please try again.');
          break;
      }
    }
  };

  // The handleLogout function has been removed from here.

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="custom-card p-4">
            <Card.Body>
              <h2 className="text-center mb-4 text-primary-dark">
                {isRegistering ? 'Register' : 'Login'}
              </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}

              {/* The logout button is no longer rendered here */}
              {currentUser && !currentUser.isAnonymous ? (
                <div className="text-center">
                  <p className="text-secondary-dark">Logged in as: <span className="fw-bold">{currentUser.email}</span></p>
                  <p className="text-secondary-dark">Your User ID: <span className="fw-bold">{currentUser.uid}</span></p>
                  {/* The logout button was here */}
                </div>
              ) : (
                <Form onSubmit={handleAuthAction}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="text-secondary-dark">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="text-secondary-dark">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 mb-3">
                    {isRegistering ? 'Register' : 'Login'}
                  </Button>

                  <Button
                    variant="link"
                    className="w-100 text-primary-dark"
                    onClick={() => setIsRegistering(!isRegistering)}
                  >
                    {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
