import { useParams } from "react-router-dom";
import ReviewList from "../../components/ReviewList";
import ProviderTopBar from "@/components/provider/ProviderTopBar";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const ServiceReviewsPage = () => {
  const { serviceType } = useParams();

  const title = formatServiceTitle(serviceType);

  const reviews = [
    {
      id: 1,
      customer: "Liam Brown",
      rating: 5,
      comment: "Amazing experience! Highly recommend.",
      date: "2024-01-21",
    },
    {
      id: 2,
      customer: "Sophia Lee",
      rating: 4,
      comment: "Great guide and very friendly.",
      date: "2024-01-18",
    },
    {
      id: 3,
      customer: "Oliver Smith",
      rating: 5,
      comment: "Best tour of my life! Thank you.",
      date: "2024-01-15",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default ServiceReviewsPage;
