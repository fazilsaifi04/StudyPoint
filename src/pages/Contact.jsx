import React from "react"

import Footer from "../components/common/Footer"
import ContactDetails from "../components/ContactPage/ContactDetails"
import ContactForm from "../components/ContactPage/ContactForm"
import ReviewSlider from "../components/common/ReviewSlider"

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      <div className=' mb-16 mt-3 w-screen'>
        <h2 className='text-center text-4xl font-semibold mt-8 text-richblack-5 mb-5'>Reviews from other learners</h2>
        <ReviewSlider />
      </div>
      <Footer />
    </div>
  )
}

export default Contact