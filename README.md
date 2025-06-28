# 🧠 ZeroQueue – AI-Powered Serverless Interview Screener

ZeroQueue is a fully serverless application that automates asynchronous job interviews using AI. Candidates record and upload their video/audio responses, which are analyzed using AWS services to generate structured reports. It enables faster, unbiased, and scalable hiring for modern organizations.

---

## 🚀 Live Demo

Frontend: [https://zeroqueue-git-main-ndemafia-wilsmiths-projects.vercel.app/](https://zeroqueue-git-main-ndemafia-wilsmiths-projects.vercel.app/)  
Demo Video: [YouTube Link](#) *(Still working on it)*

---

## 🛠️ Technologies Used

### Languages
- JavaScript (React Frontend)
- Python (AWS Lambda Functions)

### Frameworks & Tools
- React
- Tailwind CSS
- Boto3 (AWS SDK for Python)

### AWS Services
- **AWS Lambda** – Core processing logic (video upload, transcription, reporting)
- **Amazon API Gateway** – REST interface to Lambda
- **Amazon S3** – Stores candidate video/audio responses and transcript outputs
- **AWS Transcribe** – Converts recorded interviews into text
- **Amazon Bedrock (Claude)** – Evaluates transcripts for skill relevance and sentiment
- **Amazon Comprehend** – Sentiment and key phrase analysis
- **Amazon EventBridge** – Triggers post-upload processing
- **Amazon DynamoDB** – Stores logs of transcription and analysis results

### Hosting Platforms
- **Vercel** – Hosting the React frontend
- **GitHub** – Source code version control
- **YouTube** – Project demo video hosting

---

## 📁 Folder Structure

<pre> ```plaintext ├── backend-lambda/ │ ├── GeneratePresignedURL.py │ ├── GetAnalyzedInterviews.py │ └── ProcessInterviewUpload.py ├── / (React + Tailwind app, hosted on Vercel) ├── README.md ``` </pre>

## 💡 What It Does

1. **Job Description Upload** – HR uploads or defines job criteria (skills, tone, etc.)
2. **Candidate Submission** – Users record/upload audio or video responses
3. **AI-Powered Analysis** – AWS services transcribe and analyze responses
4. **Scoring & Reports** – Sentiment, skill match, and behavioral analysis is scored
5. **Dashboard** – View all analyzed candidates with insights

---

## 🏗️ How We Built It [📂 View Lambda Code](https://github.com/ndemafiawilsmith/zeroqueue/tree/main/backend-lambda)


### 🔹 `GeneratePresignedURL.py`
Generates a secure, time-limited URL for candidates to upload video/audio files to S3.

### 🔹 `ProcessInterviewUpload.py`
Triggered by EventBridge when an S3 upload occurs. Starts a Transcribe job and logs metadata in DynamoDB.

### 🔹 `GetAnalyzedInterviews.py`
Fetches all interview entries from DynamoDB that have completed analysis and returns them as a structured JSON list.

---

## ⚠️ Challenges We Faced

- Handling real-time video uploads securely to S3
- Managing async Lambda workflows and waiting for Transcribe to complete
- Designing prompts for Amazon Bedrock to generate fair and insightful scoring
- Ensuring CORS support and secure API access
- Keeping the entire stack scalable and serverless

---

## ✅ Accomplishments We're Proud Of

- Fully serverless infrastructure using AWS Lambda
- Seamless integration with Transcribe, Bedrock, and Comprehend
- Clean UI/UX for async video interviews
- Intelligent scoring and candidate ranking without manual intervention

---

## 📚 What We Learned

- How to architect and deploy Lambda functions with S3, EventBridge, and API Gateway
- How to use AWS Transcribe and Comprehend effectively
- Prompt engineering with Amazon Bedrock (Claude)
- Designing secure, scalable serverless systems
- Optimizing frontend upload UX with pre-signed S3 URLs

---

## 🔮 What's Next for ZeroQueue

- Dynamic follow-up questions based on candidate responses
- Admin dashboard for HR to review, tag, and export candidates
- Integration with ATS platforms like Greenhouse or Workable
- Support for multiple languages and dialects
- Bias detection and fairness scoring

---

## 📦 How to Run Locally

### Requirements
- AWS CLI configured with necessary IAM roles
- Node.js and Python 3.9+
- Vercel account (for frontend deployment)

### Running Frontend
```bash
cd frontend
npm install
npm run dev
