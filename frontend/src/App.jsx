import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App(){

  return(

    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

    </Routes>

  )

}
<h1 className="text-4xl text-blue-600 font-bold">
  ShareCircle
</h1>

export default App;