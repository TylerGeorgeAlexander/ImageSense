import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

// TODO: This example doesn't handle email verification. In a production application, you should send an email verification link to the user's email address and only activate the account when the link is clicked.

// TODO: Remember to also add validation and sanitization to your inputs to prevent XSS attacks and improve user experience.

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/api/register", {
        name,
        email,
        password,
      });
      if (response.data.success) {
        // TODO: Send email verification link to the user's email address

        // You can redirect to login or home page
        router.push("/login");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <div className="text-center mb-4">
            <img
              src="/ImageSense-logos/ImageSense-logos_black.png"
              alt="ImageSense Logo"
              className="img-fluid"
            />
          </div>
        </Col>
        <Col xs={12} md={6} className="d-flex align-items-center">
          <div className="w-100 m-4">
            <h1 className="text-center mb-4">Register</h1>
            <Form onSubmit={handleRegister}>
              <Form.Group controlId="formName">
                <Form.Label className="text-center m-2">Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  aria-label="Name"
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label className="text-center m-2">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  aria-label="Email"
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label className="text-center m-2">Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  aria-label="Password"
                />
              </Form.Group>
              <Form.Group controlId="formConfirmPassword">
                <Form.Label className="text-center m-2">
                  Confirm Password
                </Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  aria-label="Confirm Password"
                />
              </Form.Group>
              <div className="text-center mt-4">
                <Button variant="primary" type="submit" className="m-2">
                  Register
                </Button>
              </div>
            </Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="text-center mt-3">
              <p>
                Already have an account? <Link href="/login">Login</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
