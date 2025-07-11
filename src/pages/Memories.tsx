// src/pages/RecuerdosPage.tsx
import BannerMemories from '../components/BannerMemories'
import MemoriesTimeline from '../components/MemoriesTimeline'
import { FC } from 'react'


export const MemoriesPage: FC = () => (
  <>
    <BannerMemories />
    <MemoriesTimeline/>
  </>
)
export default MemoriesPage
