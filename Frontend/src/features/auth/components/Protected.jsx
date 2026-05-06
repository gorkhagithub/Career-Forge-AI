
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if(loading){
        return (<main className="loading-screen" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', padding: '20px'}}>
            <div>
                <h2>Waking up the server...</h2>
                <p style={{color: '#888', marginTop: '10px'}}>This may take up to 60 seconds on the first load.</p>
            </div>
        </main>)
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected
