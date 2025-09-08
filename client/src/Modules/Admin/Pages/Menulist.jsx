import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { showToast } from "@/utils/customToast";

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState(null);
  const [editingMenu, setEditingMenu] = useState(null);
  const [deletingMenu, setDeletingMenu] = useState(null);
  const [form, setForm] = useState({ title: "", content_text: [] });
  const [image, setImage] = useState(null);

  // Fetch all menus
  const fetchMenus = async () => {
    try {
      const response = await axiosInstance.get("/menus");
      setMenus(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch menus");
      showToast("error", "Failed to fetch menus");
    }
  };

  // Delete menu
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/menus/${deletingMenu._id}`);
      setMenus(menus.filter((menu) => menu._id !== deletingMenu._id));
      showToast("success", "Menu deleted successfully!");
      setDeletingMenu(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete menu");
      showToast("error", "Failed to delete menu");
    }
  };

  // Open edit modal
  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setForm({
      title: menu.title,
      content_text: menu.content_text || [],
    });
    setImage(null);
  };

  // Save edit
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content_text", JSON.stringify(form.content_text));
      if (image) formData.append("image", image);

      const response = await axiosInstance.put(
        `/menus/${editingMenu._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMenus(
        menus.map((m) => (m._id === editingMenu._id ? response.data : m))
      );
      setEditingMenu(null);
      showToast("success", "Menu updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update menu");
      showToast("error", "Failed to update menu");
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">
        Menu Management
      </h2>

      {error && (
        <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-6 text-sm">
          {error}
        </p>
      )}

      {/* Menu list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menus.map((menu) => (
          <div
            key={menu._id}
            className="group bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {menu.image_url && (
              <div className="relative">
                <img
                  src={menu.image_url} // Use image_url directly
                  alt={menu.title}
                  className="h-48 w-full object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}
            <div className="p-5 flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                {menu.title}
              </h3>
              <ul className="list-disc ml-5 text-gray-600 text-sm space-y-1">
                {menu.content_text.map((item, index) => (
                  <li key={index} className="line-clamp-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center px-5 py-4 bg-gray-100 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(menu)}
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
                  onClick={() => setDeletingMenu(menu)}
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
        ))}
      </div>

      {/* Edit Modal */}
      {editingMenu && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-100 animate-fade-in relative">
            <button
              onClick={() => setEditingMenu(null)}
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
              <span>✏️</span> Edit Menu
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menu Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter menu title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menu Items
                </label>
                <textarea
                  value={form.content_text.join("\n")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content_text: e.target.value.split("\n"),
                    })
                  }
                  placeholder="Enter one item per line"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                />
                {editingMenu.image_url && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                    <img
                      src={editingMenu.image_url} // Use image_url directly
                      alt="Current menu"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMenu(null)}
                  className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-sm transition-all duration-200 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-all duration-200 active:scale-95"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMenu && (
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
            <h2 className="text-gray-900 font-semibold mt-4 text-xl">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Do you really want to delete <b>{deletingMenu.title}</b>? <br />
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-4 mt-5 w-full">
              <button
                type="button"
                onClick={() => setDeletingMenu(null)}
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
    </div>
  );
};

export default MenuList;