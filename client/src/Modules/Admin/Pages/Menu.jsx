import React, { useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { showToast } from "@/utils/customToast"; // ✅ import your toast function

const MenuForm = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [contentItems, setContentItems] = useState([]);
  const [newContent, setNewContent] = useState("");

  // Handle image upload + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Add new content item
  const addContentItem = () => {
    if (newContent.trim() !== "") {
      setContentItems([...contentItems, newContent]);
      setNewContent("");
    }
  };

  // Remove content item
  const removeContentItem = (index) => {
    const updated = contentItems.filter((_, i) => i !== index);
    setContentItems(updated);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    if (image) formData.append("image", image);
    formData.append("content_text", JSON.stringify(contentItems));

    try {
      await axiosInstance.post("/menus", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Show success toast
      showToast("success", "Menu created successfully!");

      // Reset form
      setTitle("");
      setImage(null);
      setPreview(null);
      setContentItems([]);
      setNewContent("");
    } catch (err) {
      // ✅ Show error toast
      showToast(
        "error",
        err.response?.data?.message || "Failed to create menu"
      );
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Create Menu</h2>

        {/* Title */}
        <div>
          <label className="block text-gray-600 mb-1">Menu Title</label>
          <input
            type="text"
            placeholder="Enter menu title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-600 mb-1">Menu Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-md p-2"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 w-32 h-32 object-cover rounded-md border"
            />
          )}
        </div>

        {/* Content Items */}
        <div>
          <label className="block text-gray-600 mb-1">Menu Items</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add item (e.g. Paneer Butter Masala)"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="flex-1 border rounded-md p-2"
            />
            <button
              type="button"
              onClick={addContentItem}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add
            </button>
          </div>

          {/* List of items */}
          <ul className="mt-3 space-y-2">
            {contentItems.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-50 p-2 rounded-md border"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeContentItem(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition"
        >
          Save Menu
        </button>
      </form>
    </div>
  );
};

export default MenuForm;
