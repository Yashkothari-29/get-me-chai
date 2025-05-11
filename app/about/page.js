import React from 'react'

const about = () => {
  return (
    <div className='text-white'>
    {/* //create the about page in designing the pagemake sure to use the tailwind css for the design of the page */}

      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center my-10">About Us</h1>
        <p className="text-center">
          GET ME A CHAI is a platform that allows your fans to buy you a chai.
          <br />
          <br />
          We are a team of developers who are passionate about creating
          innovative solutions to help creators like you.
        </p>
        </div>

      

    </div>
  )
}

export default about


// add metaDATA to the about page

export async function generatemetadat({ params }) {
  return {
    title: "About Us",
    description: "GET ME A CHAI is a platform that allows your fans to buy you a chai."
    // image: "/about.jpg",
  };
}
