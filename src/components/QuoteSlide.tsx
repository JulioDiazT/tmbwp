import { FC, PropsWithChildren } from 'react'
import { Quote } from 'lucide-react'

const QuoteSlide: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col items-center text-center px-6">
    <Quote size={40} className="text-yellow-400 mb-4 shrink-0" />
    <p className="text-lg italic max-w-prose">{children}</p>
  </div>
)
export default QuoteSlide
