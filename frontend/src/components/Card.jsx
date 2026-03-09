import React from 'react'

function Card({image}) {
  return (
    <div className=' w-20 h-40 lg:w-40 lg:h-60 bg-[#030326] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white'>
        <img src={image} className='h-full object-cover' />

    </div>
  )
}

export default Card