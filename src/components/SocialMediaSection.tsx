import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import RideHighlightCard from './RideHighlightCard'
import InstagramFeed     from './InstagramFeed'

import rideMonthImage from '../assets/banner-recuerdos.jpg'

const SocialMediaSection: FC = () => {
  const { t } = useTranslation()
  return (
    <section className="py-20 bg-gray-50">
      <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-andesnavy uppercase mb-14">
        {t('memories.social.title', 'Síguenos y pedalea desde la pantalla')}
      </h2>

      {/* Ride of the Month */}
      <RideHighlightCard
        image={rideMonthImage}
        title={t('memories.ride.title', 'Ruta Las Herrerías')}
        desc={t(
          'memories.ride.desc',
          '35 km de pura emoción, arte urbano y ceviche al final.'
        )}
      />

      {/* Instagram feed */}
      <div className="mt-16 max-w-5xl mx-auto">
        <InstagramFeed />
      </div>
    </section>
  )
}

export default SocialMediaSection
