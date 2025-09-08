import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { showToast } from "@/utils/customToast";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, X } from "lucide-react";

const FranchisesList = () => {
  const [franchises, setFranchises] = useState([]);
  const [error, setError] = useState(null);
  const [editingFranchise, setEditingFranchise] = useState(null);
  const [deletingFranchise, setDeletingFranchise] = useState(null);
  const [form, setForm] = useState({
    title: "",
    contents: [],
    location_map_url: "",
    images_url: [],
  });
  const [newImages, setNewImages] = useState([]);

  // Fetch all franchises
  const fetchFranchises = async () => {
    try {
      const response = await axiosInstance.get("/franchises");
      setFranchises(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch franchises");
      showToast("error", "Failed to fetch franchises");
    }
  };

  // Delete franchise
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/franchises/${deletingFranchise._id}`);
      setFranchises(
        franchises.filter(
          (franchise) => franchise._id !== deletingFranchise._id
        )
      );
      showToast("success", "Franchise deleted successfully!");
      setDeletingFranchise(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete franchise");
      showToast("error", "Failed to delete franchise");
    }
  };

  // Open edit modal
  const handleEdit = (franchise) => {
    setEditingFranchise(franchise);
    setForm({
      title: franchise.title,
      contents: franchise.contents || [],
      location_map_url: franchise.location_map_url || "",
      images_url: franchise.images_url || [],
    });
    setNewImages([]);
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images_url: prev.images_url.filter((_, i) => i !== index),
    }));
  };

  // Save edit
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.title || form.contents.some((c) => !c.heading || !c.content)) {
      showToast("error", "Please fill all required fields");
      return;
    }
    try {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      const validImages = newImages.filter((image) => {
        if (image.size > maxSize) {
          showToast("error", `Image ${image.name} exceeds 5MB limit`);
          return false;
        }
        return true;
      });

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("contents", JSON.stringify(form.contents));
      formData.append("location_map_url", form.location_map_url);
      formData.append("images_url", JSON.stringify(form.images_url)); // Send existing images to keep
      validImages.forEach((image) => formData.append("images", image));

      const response = await axiosInstance.put(
        `/franchises/${editingFranchise._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFranchises(
        franchises.map((f) =>
          f._id === editingFranchise._id ? response.data : f
        )
      );
      setEditingFranchise(null);
      setNewImages([]);
      showToast("success", "Franchise updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update franchise");
      showToast("error", "Failed to update franchise");
    }
  };

  // Handle content section changes in edit modal
  const handleContentChange = (index, e) => {
    const { name, value } = e.target;
    const newContents = [...form.contents];
    newContents[index] = { ...newContents[index], [name]: value };
    setForm((prev) => ({ ...prev, contents: newContents }));
  };

  // Add new content section in edit modal
  const addContentSection = () => {
    setForm((prev) => ({
      ...prev,
      contents: [...prev.contents, { heading: "", content: "" }],
    }));
  };

  // Remove content section in edit modal
  const removeContentSection = (index) => {
    if (form.contents.length > 1) {
      setForm((prev) => ({
        ...prev,
        contents: prev.contents.filter((_, i) => i !== index),
      }));
    } else {
      showToast("error", "At least one content section is required");
    }
  };

  useEffect(() => {
    fetchFranchises();
  }, []);

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
          Franchise Management
        </h2>
      </div>

      {error && (
        <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-6 text-sm">
          {error}
        </p>
      )}

      {/* Franchise list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {franchises.map((franchise) => (
          <div
            key={franchise._id}
            className="group bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {franchise.images_url && franchise.images_url.length > 0 && (
              <div className="relative">
                <img
                  src={franchise.images_url[0]}
                  alt={franchise.title}
                  className="h-32 sm:h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-4 sm:p-5 flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 line-clamp-2">
                {franchise.title}
              </h3>
              <ul className="list-disc ml-5 text-gray-600 text-sm space-y-1 max-h-24 sm:max-h-32 overflow-y-auto">
                {franchise.contents.map((item, index) => (
                  <li key={index} className="line-clamp-1">
                    <strong>{item.heading}</strong>: {item.content}
                  </li>
                ))}
              </ul>
              {franchise.location_map_url && (
                <p className="text-sm text-gray-600 mt-2 sm:mt-3">
                  <a
                    href={franchise.location_map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-800"
                  >
                    View Location
                  </a>
                </p>
              )}
            </div>
            <div className="flex items-center px-4 sm:px-5 py-3 sm:py-4 bg-gray-100 border-t border-gray-200">
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => handleEdit(franchise)}
                  className="text-violet-600 hover:text-violet-800 transition-colors duration-200 p-1"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => setDeletingFranchise(franchise)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingFranchise && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] 
  overflow-y-auto p-6 border border-gray-100 animate-fade-in relative"
          >
            <button
              onClick={() => setEditingFranchise(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              title="Close"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
              <span>✏️</span> Edit Franchise
            </h2>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Franchise Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter franchise title"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Content Sections
                </label>
                <div className="max-h-64 sm:max-h-80 overflow-y-auto pr-2">
                  {form.contents.map((content, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 p-3 rounded-lg mb-2 bg-gray-50"
                    >
                      <input
                        type="text"
                        name="heading"
                        value={content.heading}
                        onChange={(e) => handleContentChange(index, e)}
                        placeholder="Section Heading"
                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 mb-2 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
                        required
                      />
                      <textarea
                        name="content"
                        value={content.content}
                        onChange={(e) => handleContentChange(index, e)}
                        placeholder="Section Content"
                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
                        rows="3"
                        required
                      />
                      {form.contents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentSection(index)}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove Section
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addContentSection}
                  className="mt-2 px-3 sm:px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all duration-200 text-sm"
                >
                  Add Content Section
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Upload Images (Max 20, 5MB each)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setNewImages(Array.from(e.target.files))}
                  className="w-full text-sm text-gray-500 file:mr-3 sm:mr-4 file:py-2 file:px-3 sm:px-4 file:rounded-lg file:border-0 file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 transition-all duration-200"
                />
                {form.images_url.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Current Images:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {form.images_url.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Current image ${index + 1}`}
                            className="w-full h-20 sm:h-24 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-all duration-200"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {newImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">New Images:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {newImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`New image ${index + 1}`}
                            className="w-full h-20 sm:h-24 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setNewImages(
                                newImages.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-all duration-200"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Location Map URL
                </label>
                <input
                  type="url"
                  value={form.location_map_url}
                  onChange={(e) =>
                    setForm({ ...form, location_map_url: e.target.value })
                  }
                  placeholder="https://maps.google.com/..."
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFranchise(null)}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-sm transition-all duration-200 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 font-medium text-sm transition-all duration-200 active:scale-95"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingFranchise && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="flex flex-col items-center bg-white shadow-2xl rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full max-w-full sm:max-w-md border border-gray-100 animate-fade-in">
            <div className="flex items-center justify-center p-3 sm:p-4 bg-red-100 rounded-full">
              <Trash2 size={24} sm={28} color="#DC2626" />
            </div>
            <h2 className="text-gray-900 font-semibold mt-3 sm:mt-4 text-lg sm:text-xl">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mt-2 text-center px-2">
              Do you really want to delete <b>{deletingFranchise.title}</b>?{" "}
              <br />
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-5 w-full">
              <button
                type="button"
                onClick={() => setDeletingFranchise(null)}
                className="w-full sm:w-32 h-9 sm:h-10 rounded-lg border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full sm:w-32 h-9 sm:h-10 rounded-lg text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchisesList;
