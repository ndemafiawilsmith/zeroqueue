// InterviewCard.tsx
import { formatDistanceToNow } from "date-fns";

interface Analysis {
  score?: string;
  strengths?: string;
  weaknesses?: string;
  tone?: string;
  summary?: string;
}

interface InterviewCardProps {
  id: string;
  transcript: string;
  analysis: Analysis;
  timestamp: string;
}

export default function InterviewCard({ id, transcript, analysis, timestamp }: InterviewCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-indigo-600 mb-2">
        Submission ID: {id}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Submitted {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
      </p>
      <p className="mb-2 text-gray-700">
        <strong>Transcript:</strong> {transcript}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Score:</strong> {analysis.score}</p>
        <p><strong>Strengths:</strong> {analysis.strengths}</p>
        <p><strong>Weaknesses:</strong> {analysis.weaknesses}</p>
        <p><strong>Tone:</strong> {analysis.tone}</p>
        <p className="sm:col-span-2">
          <strong>Summary:</strong> {analysis.summary}
        </p>
      </div>
    </div>
  );
}
