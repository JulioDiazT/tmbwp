import HeroCarousel from '../components/HeroCarousel'
import ImpactMetrics from '../components/ImpactMetrics'
import AboutUsSection from '../components/AboutUsSection'
import TeamSection from '../components/TeamSection'
import ThreeLines from '../components/ThreeLines'
import PhraseWhoWeAre from '../components/PhraseWhoWeAre'
import AlliancesLogos from '../components/AlliancesLogos'

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <ThreeLines/>
      <PhraseWhoWeAre/>
      <AboutUsSection />
      <ImpactMetrics />
      <TeamSection />
      <AlliancesLogos/>
  
    </>
  )
}
