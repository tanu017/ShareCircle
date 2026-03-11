import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if(data.token){

      localStorage.setItem("token", data.token);

      navigate("/dashboard");

    } else {

      alert("Login failed");

    }

  };

  return (
    <div>

      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/>

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
}

export default Login;