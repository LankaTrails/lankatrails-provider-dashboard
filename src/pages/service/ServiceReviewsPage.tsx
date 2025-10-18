import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewList from "../../components/ReviewList";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { getReviews } from "@/services/review";
import type { ReviewResponse } from "@/types/reviewTypes";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const ServiceReviewsPage = () => {
  const { serviceType, id } = useParams();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = formatServiceTitle(serviceType);
  const serviceId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    const fetchReviews = async () => {
      if (!serviceId) {
        setError("Invalid service ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getReviews(serviceId);
        setReviewData(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [serviceId]);

  const handleBackClick = () => {
    navigate(`/provider/${serviceType}/${id}/view`);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-4 p-2">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Service
          </button>
        </div>
        <h1 className="text-2xl p-2 font-bold">{title} Reviews</h1>
        <ProviderTopBar />
      </div>

      {!serviceId ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p className="font-medium">Invalid Service</p>
              <p className="text-sm text-muted-foreground mt-1">
                Unable to identify the service to show reviews for.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ReviewList
          reviewData={reviewData || undefined}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default ServiceReviewsPage;
