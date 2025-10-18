/**
 * RatingsAnalytics Component
 * Comprehensive ratings and reviews analytics visualization
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Star, TrendingUp, TrendingDown, Users, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data - Replace with actual API data
const ratingTrends = [
  { month: 'Jan', rating: 4.2, reviews: 12 },
  { month: 'Feb', rating: 4.3, reviews: 15 },
  { month: 'Mar', rating: 4.5, reviews: 18 },
  { month: 'Apr', rating: 4.6, reviews: 22 },
  { month: 'May', rating: 4.7, reviews: 20 },
  { month: 'Jun', rating: 4.8, reviews: 25 },
];

const ratingDistribution = [
  { stars: 5, count: 150, percentage: 65 },
  { stars: 4, count: 50, percentage: 22 },
  { stars: 3, count: 20, percentage: 9 },
  { stars: 2, count: 6, percentage: 3 },
  { stars: 1, count: 4, percentage: 1 },
];

const recentReviews = [
  {
    id: 1,
    customer: 'Liam Brown',
    rating: 5,
    comment: 'Amazing experience! Highly recommend.',
    date: '2024-01-21',
    service: 'Sigiriya Rock Climb',
  },
  {
    id: 2,
    customer: 'Sophia Lee',
    rating: 4,
    comment: 'Great guide and very friendly.',
    date: '2024-01-18',
    service: 'Cultural Triangle Tour',
  },
  {
    id: 3,
    customer: 'Oliver Smith',
    rating: 5,
    comment: 'Best tour of my life! Thank you.',
    date: '2024-01-15',
    service: 'Wildlife Safari',
  },
];

const stats = {
  averageRating: 4.8,
  totalReviews: 230,
  monthlyChange: +0.2,
  responseRate: 95,
};

// Star rating component
const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({
  rating,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : star <= rating
              ? 'fill-yellow-200 text-yellow-400'
              : 'fill-gray-200 text-gray-300'
          )}
        />
      ))}
    </div>
  );
};

export const RatingsAnalytics: React.FC = () => {
  const totalReviews = ratingDistribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-bold">{stats.averageRating}</p>
                  <span className="text-sm text-gray-500">/ 5.0</span>
                </div>
                <StarRating rating={stats.averageRating} size="sm" />
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            {stats.monthlyChange > 0 ? (
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+{stats.monthlyChange} from last month</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>{stats.monthlyChange} from last month</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold mt-1">{stats.totalReviews}</p>
                <p className="text-xs text-gray-500 mt-1">All-time reviews</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">5-Star Reviews</p>
                <p className="text-3xl font-bold mt-1">
                  {Math.round((ratingDistribution[0].count / totalReviews) * 100)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {ratingDistribution[0].count} reviews
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-3xl font-bold mt-1">{stats.responseRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Replied to reviews</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of all customer ratings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={item.percentage} className="w-32 h-2" />
                    <span className="text-gray-600 w-12 text-right">
                      {item.count}
                    </span>
                    <span className="text-gray-500 w-10 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rating Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Trends</CardTitle>
            <CardDescription>Average rating over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ratingTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis domain={[0, 5]} stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  name="Avg Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Review Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Review Volume</CardTitle>
          <CardDescription>Number of reviews received per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="reviews" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Reviews" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest customer feedback</CardDescription>
            </div>
            <Badge variant="secondary">{recentReviews.length} new</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentReviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{review.customer}</p>
                  <p className="text-sm text-gray-600">{review.service}</p>
                </div>
                <div className="text-right">
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingsAnalytics;
