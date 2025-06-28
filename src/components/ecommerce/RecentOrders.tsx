import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Spinner from "../../components/interviews/Spinner";

interface Interview {
  submission_id: string;
  interviewee_name?: string;
  interviewee_email?: string;
  transcript?: string;
  status?: string;
  timestamp?: string;
}

export default function RecentInterviewsTable() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  // const fetchInterviews = async () => {
  //   try {
  //     const res = await fetch(
  //       "https://8xtz5b2546.execute-api.us-east-1.amazonaws.com/interviews"
  //     );
  //     const data = await res.json();
  //     setInterviews(data);
  //   } catch (err) {
  //     console.error("Error fetching interviews:", err);
  //   }
  // };

  useEffect(() => {
    let isMounted = true;

    const fetchAndSet = async () => {
      try {
        const res = await fetch(
          "https://8xtz5b2546.execute-api.us-east-1.amazonaws.com/interviews"
        );
        const data = await res.json();
        if (isMounted) {
          setInterviews(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching interviews:", err);
      }
    };

    // Fetch initially
    fetchAndSet();

    // Poll every 5 seconds
    const interval = setInterval(fetchAndSet, 5000);

    // Cleanup on unmount
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Spinner text="Loading interviews..." />
          </div>
        ) : interviews.length === 0 ? (
          <div className="p-12 text-gray-500">No interviews found.</div>
        ) : (
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Interviewee
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Transcript
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Timestamp
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                {/* <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell> */}
              </TableRow>
            </TableHeader>
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {interviews.slice(0, 10).map((item) => (
                <TableRow key={item.submission_id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {item.interviewee_name || "Anonymous"}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {item.interviewee_email || ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.transcript
                      ? item.transcript.slice(0, 60) +
                      (item.transcript.length > 60 ? "..." : "")
                      : "No transcript"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        item.status === "completed"
                          ? "success"
                          : item.status === "processing"
                            ? "success"
                            : "success"
                      }
                    >
                      {item.status
                        ? item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)
                        : "Unknown"}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <a
                      href={`/interviews/${item.submission_id}`}
                      className="text-brand-600 hover:underline text-sm"
                    >
                      View
                    </a>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
