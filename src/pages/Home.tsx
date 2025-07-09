import HeroCarousel from '../components/HeroCarousel'
import ImpactMetrics from '../components/ImpactMetrics'
import Footer from '../components/Footer'
import AboutUsSection from '../components/AboutUsSection'
import TeamSection from '../components/TeamSection'
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
