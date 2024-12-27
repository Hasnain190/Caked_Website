import React, { useState } from "react";
import { Mail } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function Button() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    message: "",
    type: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/collect-email", { email });

      setStatus({
        message: response.data.message,
        type: "success",
      });

      setLoading(false);
      toast.success(status.message);

      setEmail(""); // Clear input
    } catch (error) {
      console.error("Button.jsx", error);
      setStatus({
        message: error.response?.data?.message || "Subscription failed",
        type: "error",
      });
      setLoading(false);

      toast.error(status.message);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex">
      <ToastContainer />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-grow px-4 py-2 border rounded-l-lg"
      />
      <button
        type="submit"
        className="bg-pink-500 text-white px-4 py-2 rounded-r-lg hover:bg-pink-600"
      >
        {loading ? (
          <div class=" flex justify-center items-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-x-pink-50"></div>
          </div>
        ) : (
          <>
            <Mail className="inline mr-2" /> Notify Me When Launched
          </>
        )}
      </button>
    </form>
  );
}
