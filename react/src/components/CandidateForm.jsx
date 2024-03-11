import React from 'react';

function CandidateForm({ newCandidate, setNewCandidate, handleSubmit }) {
  const handleInputChange = (event) => {
    setNewCandidate({ ...newCandidate, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-md shadow-sm">
      <h2 className="text-xl font-bold mb-2">Add New Candidate</h2>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newCandidate.name}
          onChange={handleInputChange}
          required
        />
        {/* ... other input fields and submit button */}
      </div>
    </form>
  );
}

export default CandidateForm;
