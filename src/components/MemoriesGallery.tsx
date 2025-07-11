import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import CircularGallery from './Stack/CircularGallery/CircularGallery'
import slide1 from '../assets/slide1.png'
import slide2 from '../assets/slide2.png'
import slide3 from '../assets/slide3.png'
import slide4 from '../assets/slide4.png'

const items = [
  { image: slide1, text: '1' },
  { image: slide2, text: '2' },
  { image: slide3, text: '3' },
  { image: slide4, text: '4' }
]

const MemoriesGallery: FC = () => {
  const { t } = useTranslation()
  return (
    <section className="py-20 bg-white flex flex-col items-center gap-8">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-andesnavy uppercase text-center">
        {t('memories.gallery.title')}
      </h2>
      <div className="w-full h-[70vh] max-w-5xl">
        <CircularGallery items={items} />
      </div>
    </section>
  )
}

export default MemoriesGallery
