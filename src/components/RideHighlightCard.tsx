import { FC } from 'react'
import { Trophy } from 'lucide-react'

interface RideHighlightProps {
  image: string
  title: string
  desc:  string
}

const RideHighlightCard: FC<RideHighlightProps> = ({ image, title, desc }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-xl mx-auto">
    <img src={image} alt={title} className="h-60 w-full object-cover" />
    <div className="p-6">
      <div className="flex items-center gap-2">
        <Trophy className="text-yellow-400" />{' '}
        <span className="uppercase text-sm font-bold text-yellow-600">
          Ride of the Month
        </span>
      </div>
      <h3 className="mt-2 text-2xl font-extrabold text-andesnavy uppercase">
        {title}
      </h3>
      <p className="mt-2 text-gray-700">{desc}</p>
    </div>
  </div>
)

export default RideHighlightCard
