import { useParams } from "react-router-dom";

const ServiceViewPage = () => {
  const { id, serviceType } = useParams();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Service Details</h1>
      <p className="text-gray-700">
        <strong>Service Type:</strong> {serviceType}
      </p>
      <p className="text-gray-700">
        <strong>Service ID:</strong> {id}
      </p>
      <p className="mt-4">This is a mock view page for displaying service data.</p>
    </div>
  );
};

export default ServiceViewPage;
