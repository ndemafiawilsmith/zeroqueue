import { useEffect, useState } from "react";
import Spinner from "../ui/Spinner";

export default function RecentInterviewsTable() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">🕵️ Recent Interviews</h2>
      {loading ? (
        <Spinner text="Loading interviews..." />
      ) : interviews.length === 0 ? (
        <p className="text-gray-500">No interviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transcript</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {interviews.slice(0, 10).map((item) => (
                <tr key={item.submission_id}>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.submission_id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {item.transcript ? item.transcript.slice(0, 40) + "..." : "No transcript"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={`/interviews/${item.submission_id}`}
                      className="text-brand-600 hover:underline text-sm"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>