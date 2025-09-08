import React, { useState, useEffect } from "react";
import axios from "axios";
import { showToast } from "@/utils/customToast";
import { useParams } from "react-router-dom"; // Added useNavigate for redirection
import { X } from "lucide-react";

const FranchiseForm = () => {
  const { id } = useParams();
  const initialFormState = {
    title: "",
    contents: [{ heading: "", content: "" }],
    images: [],
    location_map_url: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch franchise data if editing
  useEffect(() => {
    if (id) {
      const fetchFranchise = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/franchises/${id}`
          );
          setFormData({
            title: response.data.title || "",
            contents: response.data.contents?.length
              ? response.data.contents
              : [{ heading: "", content: "" }],
            images: [], // Keep images empty as they are uploaded separately
            location_map_url: response.data.location_map_url || "",
          });
          if (response.data.images_url?.length) {
            setImagePreviews(response.data.images_url);
          }
        } catch (err) {
          showToast("error", "Failed to fetch franchise data");
        }
      };
      fetchFranchise();
    }
  }, [id]);

  // Clean up image previews on component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle content section changes
  const handleContentChange = (index, e) => {
    const { name, value } = e.target;
    const newContents = [...formData.contents];
    newContents[index] = { ...newContents[index], [name]: value };
    setFormData((prev) => ({ ...prev, contents: newContents }));
  };

  // Add new content section
  const addContentSection = () => {
    setFormData((prev) => ({
      ...prev,
      contents: [...prev.contents, { heading: "", content: "" }],
    }));
  };

  // Remove content section
  const removeContentSection = (index) => {
    if (formData.contents.length > 1) {
      setFormData((prev) => ({
        ...prev,
        contents: prev.contents.filter((_, i) => i !== index),
      }));
    } else {
      showToast("error", "At least one content section is required");
    }
  };

  // Handle image uploads (with 5MB limit and max 20 images)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", `${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    const newImages = [...formData.images, ...validFiles].slice(0, 20);
    setFormData((prev) => ({ ...prev, images: newImages }));

    // Revoke old previews to prevent memory leaks
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    const previews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
    URL.revokeObjectURL(imagePreviews[index]);
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialFormState);
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImagePreviews([]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      formData.contents.some((c) => !c.heading || !c.content)
    ) {
      showToast("error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("contents", JSON.stringify(formData.contents));
    data.append("location_map_url", formData.location_map_url);
    formData.images.forEach((image) => data.append("images", image));

    try {
      const url = id
        ? `${import.meta.env.VITE_BASE_URL}/franchises/${id}`
        : `${import.meta.env.VITE_BASE_URL}/franchises`;
      const method = id ? "put" : "post";

      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast(
        "success",
        id ? "Franchise updated successfully" : "Franchise created successfully"
      );

      // Reset form after successful submission
      resetForm();

      // Optionally redirect to a franchise list or details page
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to save franchise"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {id ? "Edit Franchise" : "Create Franchise"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-gray-50"
            placeholder="Enter franchise title"
            required
          />
        </div>

        {/* Content Sections */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content Sections
          </label>
          {formData.contents.map((content, index) => (
            <div
              key={index}
              className={`border p-4 mt-3 rounded-lg shadow-sm transition ${
                content.heading || content.content
                  ? "border-teal-400 bg-teal-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <input
                type="text"
                name="heading"
                value={content.heading}
                onChange={(e) => handleContentChange(index, e)}
                placeholder="Section Heading"
                className="p-3 w-full border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-white"
                required
              />
              <textarea
                name="content"
                value={content.content}
                onChange={(e) => handleContentChange(index, e)}
                placeholder="Section Content"
                className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-white"
                rows="4"
                required
              />
              {formData.contents.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeContentSection(index)}
                  className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                  Remove Section
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addContentSection}
            className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Add Content Section
          </button>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images (Max 20, 5MB each)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 transition"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {formData.images.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {formData.images.length} image(s) selected
            </p>
          )}
        </div>

        {/* Location Map URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location Map URL
          </label>
          <input
            type="url"
            name="location_map_url"
            value={formData.location_map_url}
            onChange={handleInputChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-gray-50"
            placeholder="https://maps.google.com/..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : id ? (
            "Update Franchise"
          ) : (
            "Create Franchise"
          )}
        </button>
      </form>
    </div>
  );
};

export default FranchiseForm;