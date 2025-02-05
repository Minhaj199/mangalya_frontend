import React, { useState } from 'react';

const ModalExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Button to open the modal */}
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Centered Div
      </button>

      {/* Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80 max-w-full">
            <p className="text-center">This is the centered div content.</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalExample;
