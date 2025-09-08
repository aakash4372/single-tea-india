import React from 'react'
import { ImagesSliderDemo } from '../Modules/Pages/Home'
import About from '../Modules/Pages/About'
import Services from '../Modules/Pages/servcies'
import Franchise from '@/Modules/Pages/franchise'
import WhatWeDo from '@/Modules/Pages/Whatwedo'
import { Gallerysection } from '@/Modules/Pages/Gallerysection'

const Homesection = () => {
  return (
    <div>
        <ImagesSliderDemo/>
        <About/>
        <Services/>
        <WhatWeDo/>
        <Franchise/>
        <Gallerysection/>
    </div>
  )
}

export default Homesection