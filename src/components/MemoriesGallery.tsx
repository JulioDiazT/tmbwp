import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import CircularGallery from './Stack/CircularGallery/CircularGallery'

const MemoriesGallery: FC = () => {
  const { t } = useTranslation()
  return (
    <section className="py-24 bg-black text-white flex flex-col items-center">
      <h2 className="mb-8 text-3xl sm:text-4xl font-bold text-center">
        {t('memories.gallery.heading', 'LOS RECUERDOS LOS CREAMOS JUNTOS/AS')}
      </h2>
      <div className="w-full h-[60vh] max-w-5xl">
        <CircularGallery />
      </div>
    </section>
  )
}

export default MemoriesGallery
