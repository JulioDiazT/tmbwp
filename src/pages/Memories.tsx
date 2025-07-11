// src/pages/RecuerdosPage.tsx
import BannerMemories from '../components/BannerMemories'
import MemoriesTimeline from '../components/MemoriesTimeline'
import MemoriesGallery from '../components/MemoriesGallery'
import { FC } from 'react'


export const MemoriesPage: FC = () => (
  <>
    <BannerMemories />
    <MemoriesTimeline />
    <MemoriesGallery />
  </>
)
export default MemoriesPage
