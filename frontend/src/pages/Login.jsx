import React from 'react'
import { useState } from 'react'

const Login = () => {

    const [state, setState] = useState("Login")
    const [formData, setformData] = useState({
      username:"",
      password:"",
      email:""
    })

    const changeHandler = (e) =>{
      setformData({...formData,[e.target.name]:e.target.value})
    }

    const login = async() =>{
      console.log("login ", formData)
      let responseData;
      await fetch('http://localhost:4000/login',{
        method:"POST",
        headers: {
          Accept: 'application/formData',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData)
      }).then((response)=> response.json()).then((data)=>responseData=data)

      if(responseData.success){
        localStorage.setItem('auth-token', responseData.token)
        window.location.replace('/')
      }else{
        alert(responseData.errors)
      }
    }    

    const signup = async() =>{
      console.log("signup ", formData)
      let responseData;
      await fetch('http://localhost:4000/signup',{
        method:"POST",
        headers: {
          Accept: 'application/formData',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData)
      }).then((response)=> response.json()).then((data)=>responseData=data)

      if(responseData.success){
        localStorage.setItem('auth-token', responseData.token)
        window.location.replace('/')
      }else{
        alert(responseData.errors)
      }
    }

  return (
    <section className='max_padd_container flexCenter flex-col pt-32'>
      <div className='max-w-[555px] h-[600px] bg-white m-auto px-14 py-10 rounded-md'>
        <h3 className='h3'>{state}</h3>
        <div className='flex flex-col gap-4 mt-7'>
          {state==="Sign Up"?<input name="username" type="text" placeholder='Your Name' value={formData.username} onChange={changeHandler} className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl'/>: ''}
          <input name="email" type="email" placeholder='Email Address' value={formData.email} onChange={changeHandler} className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl'/>
          <input name="password" type="password" placeholder='Password' value={formData.password} onChange={changeHandler} className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl'/>
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}} className='btn_dark_rounded my-5 w-full !rounded-md'>Continue</button>
        {state==="Sign Up"?
        <p className='text-black font-bold'>Already have an account? <span onClick={()=>{ setState("Login")}} className='text-secondary underline cursor-pointer '>
          Login</span></p>:
          <p className='text-black font-bold'>Create an account? <span onClick={()=>{ setState("Sign Up")}} className='text-secondary underline cursor-pointer'>
          Click here</span></p>}
        <div className='flexCenter mt-6 gap-3'>
          <input type="checkbox" name='' id='' />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </section>
  )
}

export default Login
