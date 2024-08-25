import React, { useState } from 'react';
import axios from 'axios';

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      };

      const response = await axios.post('http://localhost:5000/upload', formData, config);
      setResult(response.data.choices[0].message.content);
      setError(null);
      setProgress(0);
    } catch (error) {
      setResult('');
      setError(`Error: ${error.response ? error.response.status + ' - ' + error.response.statusText : error.message}`);
      setProgress(0);
    }
  };

  return (
    <div className="container">
      <h1>Resume Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="resume-file">Upload your resume:</label>
          <input type="file" id="resume-file" name="resume-file" onChange={handleFileChange} required />
        </div>
        <div>
          <label htmlFor="job-description">Job Description:</label>
          <textarea id="job-description" name="job-description" rows="5" value={jobDescription} onChange={handleJobDescriptionChange} required></textarea>
        </div>
        <button type="submit">Analyze</button>
      </form>
      {progress > 0 && (
        <div className="progress-bar">
          <div className="progress-indicator" style={{ width: `${progress}%` }}></div>
          <span>{progress}%</span>
        </div>
      )}
      {result && <div className="result">{result}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ResumeAnalyzer;