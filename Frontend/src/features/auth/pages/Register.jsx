
import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const {loading,handleRegister} = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!username || !email || !password) {
            setError("Please fill in all fields")
            return
        }

        const result = await handleRegister({ username, email, password })

        if (result.success) {
            navigate("/")
        } else {
            setError(result.message)
        }
    }

    if(loading){
        return (<main className="loading-screen" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', padding: '20px'}}>
            <div>
                <h2>Waking up the server...</h2>
                <p style={{color: '#888', marginTop: '10px'}}>This may take up to 60 seconds on the first load.</p>
            </div>
        </main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                {error && <div className="error-message" style={{color: "#ff4d4d", fontSize: "0.9rem", marginBottom: "1rem"}}>{error}</div>}

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            value={username}
                            type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            value={email}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            value={password}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>

                    <button className='button primary-button' type="submit">Register</button>

                </form>

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
            </div>
        </main>
    )
}

export default Register
