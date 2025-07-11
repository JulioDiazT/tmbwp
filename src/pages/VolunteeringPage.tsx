// src/pages/VolunteeringPage.tsx
import { FC } from 'react'
import BannerVolunteering from '../components/BannerVolunteering'
import VoluntarioBenefits from '../components/VoluntarioBenefits'
import  { VoluntarioPositions } from '../components/VoluntarioPositions'

export const VolunteeringPage: FC = () => {
  return (
    <>
      <BannerVolunteering />
      <VoluntarioBenefits/>
      <VoluntarioPositions />
    </>
  )
}

export default VolunteeringPage
