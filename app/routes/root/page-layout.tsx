import React from 'react'
import { Navigate, useNavigate } from 'react-router';
import { logoutUser } from '~/appwrite/auth';

const PageLayout = () => {
    const navigate = useNavigate();

    const handleLogOut = async ()=>{
        await logoutUser();
        navigate('/sign-in')
      }
  return (
    <div>
      <button onClick={handleLogOut} className='cursor-pointer'>
        <img src="/assets/icons/logout.svg" alt="logout" className='size-6' />
      </button>
      <button onClick={()=>{navigate('/dashboard')}}>
        Dashboard
      </button>
    </div>
  )
}

export default PageLayout
