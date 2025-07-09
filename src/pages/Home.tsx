import HeroCarousel from '../components/HeroCarousel'
import EventsPreview from '../components/EventsPreview'
import MapSection from '../components/MapSection'
import ImpactMetrics from '../components/ImpactMetrics'
import ParqueaderosMap from '../components/ParqueaderosTeaserMap'
import Footer from '../components/Footer'
import AboutUsSection from '../components/AboutUsSection'
import TeamSection from '../components/TeamSection'
import AboutMissionQuote from '../components/AboutMissionQuote'
import ThreeLines from '../components/ThreeLines'
import Phrase from '../components/Phrase'

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <ThreeLines/>
      <Phrase/>
      <AboutUsSection />

      <ImpactMetrics />
      <TeamSection />
      <Footer />
    </>
  )
}
