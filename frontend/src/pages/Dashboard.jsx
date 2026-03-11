import { useState } from "react";
import Chat from "../components/Chat";
import RequestList from "../components/RequestList";
import MyChats from "../components/MyChats";

function Dashboard(){

  const [connectionId,setConnectionId] = useState(null);

  const userId = "69b19c409918e5d8bfa63a85";

  return(

    <div style={{display:"flex", gap:"20px"}}>

      <MyChats setConnectionId={setConnectionId} />

      {!connectionId ? (
        <RequestList setConnectionId={setConnectionId} />
      ) : (
        <Chat connectionId={connectionId} userId={userId} />
      )}

    </div>

  )

}

export default Dashboard;