import { useState, useEffect } from "react";
import axios from "axios";
import { showToast } from "@/utils/customToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FranchiseGalleryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [franchiseGalleries, setFranchiseGalleries] = useState([]);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Fetch all franchise gallery images
  useEffect(() => {
    const fetchFranchiseGalleries = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/franchise-gallery`);
        setFranchiseGalleries(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch franchise gallery images");
        showToast("error", "Failed to fetch franchise gallery images");
      }
    };
    fetchFranchiseGalleries();
  }, []);

  // Handle file selection with size validation and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      showToast("error", "File size exceeds 5MB limit");
      setSelectedFile(null);
      setPreviewUrl(null);
    } else {
      setSelectedFile(file);
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
    }
  };

  // Handle name input change
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Clean up preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle image upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("error", "Please select an image");
      return;
    }
    if (!name.trim()) {
      showToast("error", "Please enter a name");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/franchise-gallery`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFranchiseGalleries([response.data.data, ...franchiseGalleries]);
      showToast("success", "Franchise image uploaded successfully");
      setIsModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setName("");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to upload franchise image");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle edit form submission
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("error", "Please enter a name");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("name", name);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/franchise-gallery/${editItem._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFranchiseGalleries(
        franchiseGalleries.map((item) =>
          item._id === editItem._id ? response.data.data : item
        )
      );
      showToast("success", "Franchise image updated successfully");
      setIsEditModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setName("");
      setEditItem(null);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to update franchise image");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/franchise-gallery/${deleteItemId}`);
      setFranchiseGalleries(franchiseGalleries.filter((item) => item._id !== deleteItemId));
      showToast("success", "Franchise image deleted successfully");
      setIsDeleteModalOpen(false);
      setDeleteItemId(null);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete franchise image");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Upload Button (Top Right) */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-all duration-200 active:scale-95"
        >
          Upload Franchise Image
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-6 text-sm">
          {error}
        </p>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-100 animate-fade-in relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                setName("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              title="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="M6 6 18 18" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span>📸</span> Upload Franchise Gallery Image
            </h2>
            <form onSubmit={handleUpload}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter image name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image (Max 5MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                />
                {previewUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={previewUrl}
                      alt="Selected image preview"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setName("");
                  }}
                  className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-sm transition-all duration-200 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile || !name.trim()}
                  className={`px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-all duration-200 active:scale-95 flex items-center ${
                    isUploading || !selectedFile || !name.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-100 animate-fade-in relative">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                setName("");
                setEditItem(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              title="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="M6 6 18 18" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span>✏️</span> Edit Franchise Gallery Image
            </h2>
            <form onSubmit={handleEdit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter image name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Image (Max 5MB, Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                />
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {previewUrl ? "Preview:" : "Current Image:"}
                  </p>
                  <img
                    src={
                      previewUrl ||
                      `${import.meta.env.VITE_SERVER_URL}${editItem?.image_url}`
                    }
                    alt={previewUrl ? "Selected image preview" : "Current image"}
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setName("");
                    setEditItem(null);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-sm transition-all duration-200 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !name.trim()}
                  className={`px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-all duration-200 active:scale-95 flex items-center ${
                    isUploading || !name.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="flex flex-col items-center bg-white shadow-2xl rounded-xl py-6 px-5 w-full max-w-md border border-gray-100 animate-fade-in">
            <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DC2626"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" />
              </svg>
            </div>
            <h2 className="text-gray-900 font-semibold mt-4 text-xl">Are you sure?</h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Do you really want to delete this franchise image? <br />
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-4 mt-5 w-full">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full sm:w-36 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full sm:w-36 h-10 rounded-lg text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Franchise Gallery Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {franchiseGalleries.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No images in the franchise gallery yet.
          </p>
        ) : (
          franchiseGalleries.map((gallery) => (
            <div
              key={gallery._id}
              className="group bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}${gallery.image_url}`}
                  alt={gallery.name}
                  className="h-48 w-full object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-gray-700 font-medium">{gallery.name}</p>
              </div>
              <div className="flex items-center px-5 py-4 bg-gray-100 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditItem(gallery);
                      setName(gallery.name);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    title="Edit"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setDeleteItemId(gallery._id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    title="Delete"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default FranchiseGalleryPage;