import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/api/axiosInstance";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    mobile: "",
    email: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, mobile: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/conactemail/enquiry", formData);
      toast.success(response.data.message, {
      });
      // Reset form
      setFormData({
        name: "",
        location: "",
        mobile: "",
        email: "",
        date: "",
        time: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit enquiry", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg mt-22 mb-22 rounded-2xl p-6">
      <h2 className="text-center text-lg font-semibold mb-6">
        For Franchise Enquiry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            placeholder="Enter Your Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Mobile Number with Flag */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            country={"in"}
            value={formData.mobile}
            onChange={handlePhoneChange}
            inputClass="!w-full !rounded-full !border !border-gray-300 !pl-12 !pr-4 !py-2 focus:!ring-2 focus:!ring-orange-500"
            containerClass="w-full"
            buttonClass="!rounded-l-full !border-gray-300"
            inputStyle={{ width: "100%" }}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Preferred Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Preferred Date to reach you
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Preferred Time */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Preferred time to reach you
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-semibold py-2 rounded-full hover:bg-orange-600 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Contact;