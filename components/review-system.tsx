'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Star, Plus, Copy, Check } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useToast } from "@/components/ui/use-toast"

type AvailableSegments = {
  Food: string[];
  Service: string[];
  Ambience: string[];
  Location: string[];
};

const availableSegments: AvailableSegments = {
  'Food': ['Appetizer', 'Main Course', 'Dessert'],
  'Service': ['Waiter', 'Host', 'Manager'],
  'Ambience': ['Lighting', 'Music', 'Decor'],
  'Location': ['Accessibility', 'Parking', 'Surroundings']
};

type ItemCharacteristics = {
  [key: string]: string[];
};

const itemCharacteristics: ItemCharacteristics = {
  'Appetizer': ['Flavorful', 'Well-presented', 'Appropriate portion', 'Innovative'],
  'Main Course': ['Well-cooked', 'Balanced flavors', 'Fresh ingredients', 'Satisfying portion'],
  'Dessert': ['Sweet', 'Beautifully plated', 'Texture variety', 'Indulgent'],
  'Waiter': ['Attentive', 'Knowledgeable', 'Friendly', 'Efficient'],
  'Host': ['Welcoming', 'Organized', 'Accommodating', 'Professional'],
  'Manager': ['Responsive', 'Problem-solving', 'Courteous', 'Present'],
  'Lighting': ['Appropriate brightness', 'Mood-setting', 'Well-distributed', 'Adjustable'],
  'Music': ['Fitting genre', 'Appropriate volume', 'Enhances atmosphere', 'Playlist variety'],
  'Decor': ['Cohesive theme', 'Clean', 'Comfortable', 'Visually appealing'],
  'Accessibility': ['Wheelchair friendly', 'Clear signage', 'Easy navigation', 'Accommodating facilities'],
  'Parking': ['Ample spaces', 'Well-lit', 'Easy to find', 'Convenient'],
  'Surroundings': ['Safe area', 'Scenic', 'Well-maintained', 'Quiet']
}

type Segment = {
  type: string;
  item: string;
  characteristics: string[];
  rating: number;
}

export default function ReviewSystem() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [review, setReview] = useState('')
  const [error, setError] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  // const { toast } = useToast()

  const addSegment = () => {
    setSegments([...segments, { type: '', item: '', characteristics: [], rating: 0 }])
  }

  const updateSegment = (index: number, field: keyof Segment, value: string | string[] | number) => {
    const updatedSegments = segments.map((segment, i) => 
      i === index ? { ...segment, [field]: value } : segment
    )
    setSegments(updatedSegments)
  }

  const toggleCharacteristic = (index: number, characteristic: string) => {
    const updatedSegments = segments.map((segment, i) => {
      if (i === index) {
        const updatedCharacteristics = segment.characteristics.includes(characteristic)
          ? segment.characteristics.filter(c => c !== characteristic)
          : [...segment.characteristics, characteristic]
        return { ...segment, characteristics: updatedCharacteristics }
      }
      return segment
    })
    setSegments(updatedSegments)
  }

  const generateReview = () => {
    if (segments.every(segment => segment.rating === 0)) {
      setError('Please select at least one star rating for any segment.')
      setReview('')
      return
    }

    setError('')

    const formatCharacteristics = (chars: string[]) => {
      if (chars.length === 0) return ''
      if (chars.length === 1) return chars[0].toLowerCase()
      return `${chars.slice(0, -1).join(', ').toLowerCase()} and ${chars[chars.length - 1].toLowerCase()}`
    }

    const segmentReviews = segments
      .filter(segment => segment.type && segment.item && segment.characteristics.length)
      .map(segment => `The ${segment.item.toLowerCase()} (${segment.type.toLowerCase()}) was ${formatCharacteristics(segment.characteristics)}${segment.rating ? ` and deserves ${segment.rating} stars` : ''}.`)
      .join(' ')

    const overallRating = segments.reduce((sum, segment) => sum + segment.rating, 0) / segments.length
    const overallSentiment = overallRating > 3 ? 'excellent' : 'average'
    setReview(`${segmentReviews} Overall, it was an ${overallSentiment} experience!`)
  }

  const copyReview = async () => {
    try {
      await navigator.clipboard.writeText(review)
      setIsCopied(true)
      // toast({
      //   title: "Review copied!",
      //   description: "The review has been copied to your clipboard.",
      // })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      // toast({
      //   title: "Copy failed",
      //   description: "Failed to copy the review. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const StarRating = ({ rating, setRating }: { rating: number, setRating: (value: number) => void }) => (
    <div className="flex justify-center mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          className="p-0 w-6 h-6"
          onClick={() => setRating(star)}
        >
          <Star
            className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
          <span className="sr-only">{star} stars</span>
        </Button>
      ))}
    </div>
  )

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">How did we do?</h1>
      
      {segments.map((segment, index) => (
        <div key={index} className="mb-6 p-4 border rounded-md">
          <Select onValueChange={(value) => updateSegment(index, 'type', value)}>
            <SelectTrigger className="w-full mb-2">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(availableSegments).map((segmentType) => (
                <SelectItem key={segmentType} value={segmentType}>{segmentType}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {segment.type && (
            <Select onValueChange={(value) => updateSegment(index, 'item', value)}>
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {(availableSegments[segment.type as keyof AvailableSegments] || []).map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {segment.item && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {itemCharacteristics[segment.item].map((char) => (
                <Button
                  key={char}
                  variant={segment.characteristics.includes(char) ? "default" : "outline"}
                  onClick={() => toggleCharacteristic(index, char)}
                >
                  {char}
                </Button>
              ))}
            </div>
          )}
          <StarRating 
            rating={segment.rating} 
            setRating={(value) => updateSegment(index, 'rating', value)} 
          />
        </div>
      ))}
      
      <Button onClick={addSegment} className="w-full mb-4">
        <Plus className="mr-2 h-4 w-4" /> Add New Category
      </Button>
      
      {segments.length > 0 && (
        <Button className="w-full" onClick={generateReview}>Generate Review</Button>
      )}
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {review && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h2 className="font-bold mb-2">AI-Generated Review:</h2>
          <p>{review}</p>
          <Button onClick={copyReview} className="mt-2 w-full">
            {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {isCopied ? 'Copied!' : 'Copy Review'}
          </Button>
        </div>
      )}
    </div>
  )
}