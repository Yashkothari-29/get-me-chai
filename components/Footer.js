import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-black text-white flex justify-center items-center p-4'>
      <p className='text-center'>Copyright &copy; {currentYear} GET ME A CHAI - All rights reserved!</p>
    </footer>
  )
}

export default Footer
