import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/login', { email, password });
      console.log(response)
      if (response.status == 200) {
        console.log("yes")
        localStorage.setItem('token', response.data.token); // Store the token in local storage
        router.push('/');  // Redirect to homepage on successful login
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  }
  
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      {error && <div>{error}</div>}
      <div>
        Don't have an account? <Link href="/register">Register</Link>
      </div>
    </div>
  );
}
