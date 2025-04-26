import { Header } from 'components'
import React from 'react'

const Dashboard = () => {
  const user = { name:"Jayesh", }
  return (
    <main className='dashboard wrapper'>
      <Header
        title={`Welcome ${user?.name ?? 'Guest'} `}
        description={"Track activity and destinations in real time"}
      />
      Dashboard Page contents
    </main>
  )
}

export default Dashboard
