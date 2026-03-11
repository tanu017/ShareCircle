import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {

    const res = await fetch("http://localhost:5000/api/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await res.json();

    alert(data.message);

    navigate("/login");

  };

  return(

    <div>

      <h2>Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <br/>

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

      <button onClick={register}>
        Register
      </button>

    </div>

  )

}

export default Register;