import { useEffect, useState } from "react";
// import UploadForm from "../../components/interviews/UploadForm";
import InterviewCard from "../../components/interviews/InterviewCard";
import Spinner from "../../components//interviews/Spinner";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
// import { formatDistanceToNow } from "date-fns";

export default function Home() {
  type Interview = {
    submission_id: string;
    transcript: string;
    analysis: any;
    timestamp: string;
    // add other properties if needed
  };

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [polling] = useState(false);

  const fetchInterviews = async () => {
    try {
      const res = await fetch("https://8xtz5b2546.execute-api.us-east-1.amazonaws.com/interviews");
      const data = await res.json();
      setInterviews(data);
    } catch (err) {
      console.error("Error fetching interviews:", err);
    }
  };

  useEffect(() => {
    fetchInterviews().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(() => {
      fetchInterviews();
    }, 10000);
    return () => clearInterval(interval);
  }, [polling]);

  return (
    <>
      <PageMeta
        title="Interview Dashboard"
        description="View and manage your AI-powered interview analysis."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        <div className="col-span-12">
          <EcommerceMetrics />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>

        <div className="col-span-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🕵️ Recent Interviews</h2>
          {loading ? (
            <Spinner text="Loading interviews..." />
          ) : interviews.length === 0 ? (
            <p className="text-gray-500">No interviews found.</p>
          ) : (
            <div className="grid gap-4">
              {interviews.map((item) => {
                let analysis = item.analysis;
                if (typeof analysis === "string") {
                  try {
                    analysis = JSON.parse(analysis);
                  } catch {
                    analysis = {};
                  }
                }

                return (
                  <InterviewCard
                    key={item.submission_id}
                    id={item.submission_id}
                    transcript={item.transcript}
                    analysis={analysis}
                    timestamp={item.timestamp}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
