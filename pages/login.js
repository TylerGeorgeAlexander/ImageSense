import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        router.push("/");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDemoLogin = async () => {
    // Example demo login logic
    const demoEmail = "demo@example.com";
    const demoPassword = "demopassword";

    setEmail(demoEmail);
    setPassword(demoPassword);

    // Simulate form submission
    handleLogin(new Event("submit"));
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
            <h1 className="text-center mb-4">Login</h1>
            <Form onSubmit={handleLogin}>
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
              <div className="text-center mt-4">
                <Button variant="primary" type="submit" className="m-2">
                  Login
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDemoLogin}
                  className="m-2"
                >
                  Demo Login
                </Button>
              </div>
            </Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="text-center mt-3">
              <p>
                Don't have an account? <Link href="/register">Register</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
