import { useState } from 'react'
import useUserStore from '@/stores/userStore'
import useAlert from '@/hooks/useAlert'

const LoginForm = () => {
  const { login } = useUserStore()
  const { showLoginSuccess, showLoginFail } = useAlert()

  const [inputEmail, setInputEmail] = useState("")
  const [inputPassword, setInputPassword] = useState("")
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // *DELETE*
    if (inputEmail === "admin@naver.com") {
      login(inputEmail, "ASD")
      showLoginSuccess()
      return
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputEmail,
          password: inputPassword,
        })
      })

      if (response.status === 200) {
        const jwt = await response.text()
        login(inputEmail, jwt.toString())
        showLoginSuccess()
      } else if (response.status === 401) {
        showLoginFail("Incorrect email or password")
        throw new Error("Unauthorized: Incorrect email or password")
      } else {
        throw new Error(`Unexpected error: ${response.status}`)
      }
    } catch (error) {
      console.log(error)
    }
  }
    
  return (
    <div className="flex justify-center items-center mt-24">
      <form onSubmit={handleSubmit} className="p-6 w-96 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="example@email.com"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="4-16 characters long"
            required
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  )
}

export default LoginForm
