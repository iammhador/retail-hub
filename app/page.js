"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiDatabase, FiFilter, FiChevronDown } from "react-icons/fi";
import RetailerForm from "./components/RetailerForm";
import RetailerTable from "./components/RetailerTable";

export default function Home() {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch retailers
  const fetchRetailers = async (query = "", category = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (category) params.append("category", category);

      const response = await fetch(`/api/retailers?${params.toString()}`);
      const data = await response.json();
      setRetailers(data);
    } catch (error) {
      console.error("Error fetching retailers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filtering
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories"); // Replace with actual API endpoint if needed
      const data = await response.json();
      console.log("🚀 ~ fetchCategories ~ data:", data);
      setCategories(data); // Assuming data is an array of category strings
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Load retailers and categories on initial page load
  useEffect(() => {
    fetchRetailers();
    fetchCategories();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debouncing the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchRetailers(query, filterCategory);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
    setIsFilterOpen(false);
    fetchRetailers(searchQuery, category);
  };

  // Add a new retailer
  const addRetailer = async (retailerData) => {
    try {
      const response = await fetch("/api/retailers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(retailerData),
      });

      if (!response.ok) {
        throw new Error("Failed to add retailer");
      }

      // Refresh the retailer list
      fetchRetailers(searchQuery, filterCategory);
    } catch (error) {
      console.error("Error adding retailer:", error);
      alert("Failed to add retailer. Please try again.");
    }
  };

  // Delete a retailer
  const deleteRetailer = async (id) => {
    try {
      const response = await fetch(`/api/retailers?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete retailer");
      }

      // Refresh the retailer list
      fetchRetailers(searchQuery, filterCategory);
    } catch (error) {
      console.error("Error deleting retailer:", error);
      alert("Failed to delete retailer. Please try again.");
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className="text-center mb-12  py-12 sm:py-16 px-4 sm:px-6"
      >
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 150,
            }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r    mb-4 sm:mb-6 from-rose-600 to-blue-600 leading-tight"
          >
            Retailer Management
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 100,
            }}
            className="text-base sm:text-lg md:text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto"
          >
            Simplify your business tracking with our intuitive platform.
            Seamlessly search, manage, and organize retailer information to
            drive your business forward.
          </motion.p>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search retailers..."
            className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-between w-full md:w-48 p-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition duration-300"
          >
            <div className="flex items-center">
              <FiFilter className="mr-2 text-gray-500" />
              <span>{filterCategory || "Filter Category"}</span>
            </div>
            <FiChevronDown
              className={`transition-transform duration-300 ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 mt-2 w-full md:w-48 bg-white border border-gray-300 rounded-xl shadow-lg"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className="w-full text-left p-3 hover:bg-blue-50 transition duration-300 first:rounded-t-xl last:rounded-b-xl"
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Retailer Form and Table */}
      <div className="space-y-8">
        <RetailerForm onAddRetailer={addRetailer} />
        <RetailerTable
          retailers={retailers}
          loading={loading}
          onDeleteRetailer={deleteRetailer}
        />
      </div>
    </motion.main>
  );
}
