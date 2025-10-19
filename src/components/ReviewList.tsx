import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { ReviewResponse } from "@/types/reviewTypes";

const stars = (n: number) => Array.from({ length: 5 }, (_, i) => i < n);

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

const ReviewList: React.FC<{
  reviewData?: ReviewResponse;
  isLoading?: boolean;
  error?: string | null;
}> = ({ reviewData, isLoading = false, error = null }) => (
  <Card>
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <CardTitle>Customer Reviews</CardTitle>
        {reviewData && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">
                {reviewData.averageRating.toFixed(1)}
              </span>
            </div>
            <span>•</span>
            <span>
              {reviewData.totalReviews} review
              {reviewData.totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-4 max-h-96 overflow-y-auto">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          <p className="font-medium">Unable to load reviews</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      )}

      {!isLoading &&
        !error &&
        reviewData?.reviews &&
        reviewData.reviews.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm mt-1">
              Reviews from customers will appear here once they're submitted.
            </p>
          </div>
        )}

      {!isLoading &&
        !error &&
        reviewData?.reviews &&
        reviewData.reviews.length > 0 &&
        reviewData.reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                {review.tourist.firstName} {review.tourist.lastName}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDate(review.createdDate)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {stars(5).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-4 h-4 ${
                    idx < review.rate
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm font-medium">{review.rate}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {review.review}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{review.tourist.country}</span>
            </div>
          </div>
        ))}
    </CardContent>
  </Card>
);

export default ReviewList;
