import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

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
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <div>{error}</div>}
      <div>
        Already have an account? <Link href="/login">Login</Link>
      </div>
    </div>
  );
}
