import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
interface Review {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

const stars = (n: number) => Array.from({ length: 5 }, (_, i) => i < n);

const ReviewList: React.FC<{ reviews: Review[] }> = ({ reviews }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Reviews</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 max-h-96 overflow-y-auto">
      {reviews.map((r) => (
        <div key={r.id} className="p-4 border rounded-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{r.customer}</span>
            <span className="text-sm text-muted-foreground">{r.date}</span>
          </div>
          <div className="flex items-center gap-1">
            {stars(5).map((filled, idx) => (
              <Star
                key={idx}
                className={`w-4 h-4 ${idx < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-1 text-sm">{r.rating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-gray-700">{r.comment}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default ReviewList;
