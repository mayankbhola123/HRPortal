import React, { useState, useEffect } from 'react';
import './App.css';
import CandidateList from './components/CandidateList.jsx';
import CandidateForm from './components/CandidateForm.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    currentStatus: 'Applied',
    expectedSalary: '',
    skills: [],
  });

  const getCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:3000/candidates');
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Error retrieving candidates!');
    }
  };

  const handleInputChange = (event) => {
    setNewCandidate({ ...newCandidate, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/candidates', newCandidate);
      setCandidates([...candidates, response.data]);
      setNewCandidate({ name: '', email: '', phone: '', currentStatus: 'Applied', expectedSalary: '', skills: [] });
      toast.success('Candidate added successfully!');
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast.error('Error creating candidate!');
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      // Update candidate status on backend (implementation needed) 
      // Replace with actual update logic using axios.put
      const updatedCandidate = { ...candidateId, currentStatus: newStatus };
      setCandidates(candidates.map((c) => (c.candidate_id === candidateId ? updatedCandidate : c)));
      toast.success('Candidate status updated!');
    } catch (error) {
      console.error('Error updating candidate status:', error);
      toast.error('Error updating candidate status!');
    }
  };

  useEffect(() => {
    getCandidates();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Candidate Management</h1>
      <CandidateForm newCandidate={newCandidate} setNewCandidate={setNewCandidate} handleSubmit={handleSubmit} />
      <CandidateList candidates={candidates} handleStatusChange={handleStatusChange} />
    </div>
  );
}

export default App;
