import React from 'react'
import { SiShopware } from 'react-icons/si'

function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="flex justify-center items-center text-8xl text-gray-500 ">
        <SiShopware className="mr-4" />
        <span>Mall360</span><br/>
        
      </div>
      <span className="text-primary">Log in to Continue</span>
    </div>
  )
}

export default Home
