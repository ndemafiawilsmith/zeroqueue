import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { useDropzone } from "react-dropzone";
import {
  ArrowUpIcon,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

interface InterviewLog {
  key: string;        // or use 'id' or 'filename' if your backend uses a different name
  status: string;
  // Add more fields if needed, like:
  // createdAt?: string;
  // filename?: string;
}

export default function EcommerceMetrics() {
  const [interviewCount, setInterviewCount] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    fetch("https://8xtz5b2546.execute-api.us-east-1.amazonaws.com/interviews")
      .then((res) => res.json())
      .then((data) => setInterviewCount(data.length))
      .catch((err) => console.error("Failed to fetch interview count:", err));
  }, []);

  const handleUpload = async (file: File) => {
    setUploadStatus("Requesting upload URL...");
    setUploading(true);
    try {
      const res = await fetch("https://5t0g67xj4l.execute-api.us-east-1.amazonaws.com/upload-url", {
        method: "POST",
      });
      const { uploadUrl, objectKey } = await res.json(); // assuming backend returns a key or ID to track

      setUploadStatus("Uploading...");
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "video/mp4" },
        body: file,
      });

      setUploadStatus("Uploaded! Waiting for analysis...");

      // Start polling for analysis status
      pollAnalysisStatus(objectKey);
    } catch (err) {
      console.error(err);
      setUploadStatus("❌ Upload failed.");
    }
    setUploading(false);
  };

const pollAnalysisStatus = (objectKey: string) => {
  const interval = setInterval(async () => {
    try {
      const res = await fetch("https://8xtz5b2546.execute-api.us-east-1.amazonaws.com/interviews");
      const data = await res.json();

      const analyzedItem = (data as InterviewLog[]).find(
        (item) => item.key === objectKey && item.status === "ANALYZED"
      );

      if (analyzedItem) {
        setUploadStatus("✅ Analysis Complete!");
        clearInterval(interval);

        // Update interview count after successful analysis
        setInterviewCount(data.length);
      }
    } catch (err) {
      console.error("Polling failed:", err);
    }
  }, 5000); // Poll every 5 seconds
};

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    if (file.type !== "video/mp4") {
      setUploadStatus("❌ Only MP4 videos are supported.");
      return;
    }
    handleUpload(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [],
    },
    multiple: false,
    maxFiles: 1,
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-end justify-between mt-5">
          <div className="space-y-6">
            <ComponentCard title="Upload Video">
              <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                <form
                  {...getRootProps()}
                  className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
                    ${isDragActive
                      ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                      : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                    }
                  `}
                  id="demo-upload"
                  onClick={e => uploading && e.preventDefault()}
                >
                  {/* Hidden Input */}
                  <input {...getInputProps()} disabled={uploading} />

                  <div className="dz-message flex flex-col items-center m-0!">
                    {/* Icon Container */}
                    <div className="mb-[22px] flex justify-center">
                      <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <svg
                          className="fill-current"
                          width="29"
                          height="28"
                          viewBox="0 0 29 28"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Text Content */}
                    <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                      {isDragActive ? "Drop Video Here" : "Drag & Drop MP4 Video Here"}
                    </h4>

                    <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                      Drag and drop your MP4 video here or browse
                    </span>

                    <span className="font-medium underline text-theme-sm text-brand-500">
                      Browse File
                    </span>
                    {uploadStatus && (
                      <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        {(uploading || uploadStatus.startsWith(" Uploaded!")) && (
                          <span className="animate-spin inline-flex">
                            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                              <g clipPath="url(#clip0_3755_26326)">
                                <path opacity="0.33" fillRule="evenodd" clipRule="evenodd" d="M30.2555 0.828423L29.2219 4.68689C28.6597 4.53582 28.0923 4.41429 27.5114 4.31069C26.9306 4.2071 26.3561 4.12494 25.7763 4.07233L26.1404 0.0944611C26.8303 0.15655 27.5247 0.249928 28.2138 0.37284C28.9029 0.495752 29.5868 0.648198 30.2555 0.828423Z" fill="#465FFF"></path>
                                <path opacity="0.38" fillRule="evenodd" clipRule="evenodd" d="M36.045 3.23213L34.0361 6.69316C33.0431 6.10974 31.9932 5.61774 30.8863 5.21717L32.2574 1.45954C33.5837 1.93988 34.8477 2.54117 36.045 3.23213Z" fill="#465FFF"></path>
                                <path opacity="0.42" fillRule="evenodd" clipRule="evenodd" d="M41.0092 7.06352L38.1708 9.87886C37.3532 9.05246 36.4607 8.30413 35.505 7.62577L37.8142 4.36051C38.9591 5.17419 40.0274 6.07578 41.0092 7.06352Z" fill="#465FFF"></path>
                                <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M44.8051 12.0371L41.3414 14.0298C40.7593 13.022 40.0978 12.0609 39.3533 11.1663L42.4207 8.60507C43.316 9.67897 44.1168 10.8274 44.8051 12.0371Z" fill="#465FFF"></path>
                                <path opacity="0.55" fillRule="evenodd" clipRule="evenodd" d="M47.2056 17.8284L43.3353 18.8548C43.039 17.7252 42.6355 16.6273 42.1508 15.586L45.7739 13.896C46.3613 15.1587 46.8379 16.4728 47.2056 17.8284Z" fill="#465FFF"></path>
                                <path opacity="0.6" fillRule="evenodd" clipRule="evenodd" d="M48.0046 24.0458L44.0047 24.0333C44.0115 22.8562 43.903 21.6992 43.7104 20.5576L47.6508 19.879C47.887 21.2314 48.0124 22.6353 48.0046 24.0458Z" fill="#465FFF"></path>
                                <path opacity="0.65" fillRule="evenodd" clipRule="evenodd" d="M47.6262 28.2144C47.5033 28.9035 47.3508 29.5873 47.1706 30.2561L43.3041 29.2109C43.4534 28.6586 43.5847 28.0928 43.6883 27.512C43.7919 26.9312 43.866 26.3451 43.9169 25.7751L47.9046 26.141C47.8442 26.821 47.7509 27.5154 47.6262 28.2144Z" fill="#465FFF"></path>
                                <path opacity="0.7" fillRule="evenodd" clipRule="evenodd" d="M46.5421 32.2464C46.06 33.5825 45.4587 34.8466 44.7677 36.0439L41.3067 34.0349C41.8803 33.0402 42.3839 31.9822 42.7845 30.8753L46.5421 32.2464Z" fill="#465FFF"></path>
                                <path opacity="0.75" fillRule="evenodd" clipRule="evenodd" d="M43.6422 37.8034C42.8267 38.9582 41.9252 40.0265 40.9392 40.9985L38.1221 38.1699C38.9386 37.3505 39.6968 36.4598 40.3653 35.5023L43.6422 37.8034Z" fill="#465FFF"></path>
                                <path opacity="0.8" fillRule="evenodd" clipRule="evenodd" d="M39.3853 42.4075C38.3213 43.3046 37.1728 44.1054 35.9614 44.8036L33.9686 41.3398C34.9765 40.7578 35.9295 40.0846 36.8241 39.3402L39.3853 42.4075Z" fill="#465FFF"></path>
                                <path opacity="0.95" fillRule="evenodd" clipRule="evenodd" d="M34.1028 45.7725C32.8401 46.3599 31.5259 46.8366 30.1721 47.1944L29.1341 43.3322C30.2655 43.0261 31.3616 42.6324 32.4145 42.1397L34.1028 45.7725Z" fill="#465FFF"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M28.1231 47.6414C26.759 47.8857 25.3667 48.0031 23.9544 48.0051L23.967 44.0052C25.1458 44.0021 26.3011 43.9034 27.4328 43.7091L28.1231 47.6414Z" fill="#465FFF"></path>
                                <path opacity="0.05" fillRule="evenodd" clipRule="evenodd" d="M21.8598 47.9056C21.17 47.8435 20.4756 47.7502 19.7864 47.6272C19.0973 47.5043 18.4135 47.3519 17.7447 47.1717L18.78 43.3034C19.3422 43.4544 19.908 43.5858 20.4888 43.6894C21.0696 43.793 21.6459 43.8653 22.2257 43.9179L21.8598 47.9056Z" fill="#465FFF"></path>
                                <path opacity="0.07" fillRule="evenodd" clipRule="evenodd" d="M17.1157 42.783L15.7446 46.5406C14.4201 46.0504 13.1542 45.459 11.9587 44.7581L13.9659 41.307C14.9606 41.8805 16.0106 42.3725 17.1157 42.783Z" fill="#465FFF"></path>
                                <path opacity="0.09" fillRule="evenodd" clipRule="evenodd" d="M12.4965 40.3645L10.1873 43.6297C9.04058 42.8259 7.97229 41.9243 6.99047 40.9366L9.83067 38.1114C10.6483 38.9378 11.5407 39.6861 12.4965 40.3645Z" fill="#465FFF"></path>
                                <path opacity="0.11" fillRule="evenodd" clipRule="evenodd" d="M8.64897 36.8237L5.5816 39.3849C4.68625 38.311 3.88547 37.1626 3.19717 35.9529L6.6609 33.9602C7.24297 34.968 7.90449 35.9291 8.64897 36.8237Z" fill="#465FFF"></path>
                                <path opacity="0.13" fillRule="evenodd" clipRule="evenodd" d="M5.85004 32.414L2.22875 34.0943C1.63959 32.8414 1.16293 31.5273 0.797005 30.1618L4.66735 29.1354C4.96362 30.265 5.3671 31.3629 5.85004 32.414Z" fill="#465FFF"></path>
                                <path opacity="0.15" fillRule="evenodd" clipRule="evenodd" d="M4.29026 27.4326L0.348117 28.1211C0.113685 26.7588 -0.0135221 25.3648 -0.00396891 23.9444L3.99597 23.957C3.98918 25.1341 4.09595 26.3009 4.29026 27.4326Z" fill="#465FFF"></path>
                                <path opacity="0.17" fillRule="evenodd" clipRule="evenodd" d="M4.30916 20.4884C4.20556 21.0692 4.13325 21.6455 4.08239 22.2154L0.0929215 21.8594C0.15501 21.1696 0.248388 20.4752 0.371301 19.786C0.494213 19.0969 0.648415 18.4032 0.826883 17.7443L4.69519 18.7796C4.54588 19.332 4.41275 19.9076 4.30916 20.4884Z" fill="#465FFF"></path>
                                <path opacity="0.19" fillRule="evenodd" clipRule="evenodd" d="M6.69397 13.9553C6.11864 14.9599 5.6168 16.0081 5.21622 17.1149L1.45859 15.7438C1.93893 14.4176 2.54198 13.1437 3.23119 11.9562L6.69397 13.9553Z" fill="#465FFF"></path>
                                <path opacity="0.21" fillRule="evenodd" clipRule="evenodd" d="M9.87881 9.83023C9.06401 10.6397 8.30583 11.5304 7.63732 12.4879L4.36046 10.1868C5.17414 9.04189 6.07573 7.9736 7.06347 6.99178L9.87881 9.83023Z" fill="#465FFF"></path>
                                <path opacity="0.25" fillRule="evenodd" clipRule="evenodd" d="M14.0298 6.65017C13.0219 7.23224 12.0689 7.90536 11.1743 8.64984L8.61307 5.58247C9.67712 4.68537 10.8256 3.88458 12.037 3.18644L14.0298 6.65017Z" fill="#465FFF"></path>
                                <path opacity="0.28" fillRule="evenodd" clipRule="evenodd" d="M18.8673 4.65805C17.736 4.96415 16.6399 5.3578 15.587 5.85058L13.8969 2.22753C15.1596 1.64013 16.4738 1.16347 17.8294 0.795788L18.8673 4.65805Z" fill="#465FFF"></path>
                                <path opacity="0.3" fillRule="evenodd" clipRule="evenodd" d="M24.035 3.99497C22.8579 3.98818 21.7026 4.08686 20.5692 4.291L19.8807 0.348865C21.243 0.114433 22.637 -0.0127737 24.0475 -0.00497648L24.035 3.99497Z" fill="#465FFF"></path>
                              </g>
                              <defs>
                                <clipPath id="clip0_3755_26326">
                                  <rect width="48" height="48" fill="white"></rect>
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                        )}
                        <span>{uploadStatus}</span>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </ComponentCard>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      <br />
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div className="space-y-6">
            <ComponentCard title="Total Interviews">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Interviews
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {interviewCount !== null ? interviewCount : "Loading..."}
                  </h4>
                </div>
                <Badge color="success">
                  <ArrowUpIcon />
                  Live
                </Badge>
              </div>
            </ComponentCard>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
