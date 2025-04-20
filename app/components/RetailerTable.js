"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiPackage,
  FiAlertCircle,
  FiLoader,
  FiMapPin,
  FiTag,
  FiPhone,
  FiCalendar,
  FiEdit3,
  FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ModernRetailerTable({
  retailers,
  loading,
  onDeleteRetailer,
  onEditRetailer,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [expandedRows, setExpandedRows] = useState({});

  // Sorting function
  const sortedRetailers = [...retailers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // Toggle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Loading state with animation
  if (loading) {
    return (
      <motion.div
        className="text-center py-16 rounded-2xl bg-white shadow-2xl border border-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        >
          <FiLoader className="h-12 w-12 text-blue-500 mx-auto" />
        </motion.div>
        <p className="mt-4 text-gray-600 font-medium text-lg">
          Loading retailers...
        </p>
      </motion.div>
    );
  }

  // Empty state with animation
  if (retailers.length === 0) {
    return (
      <motion.div
        className="text-center py-16 bg-blue-50 rounded-2xl shadow-2xl border border-blue-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiAlertCircle className="h-14 w-14 text-blue-400 mx-auto" />
        </motion.div>
        <p className="mt-4 text-blue-600 font-semibold text-xl">
          No retailers found. Add a new retailer to get started!
        </p>
      </motion.div>
    );
  }

  // Date formatting
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Table and row animations
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-2xl border border-blue-100 ">
      <motion.div
        className="overflow-x-auto"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="min-w-full bg-white">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
              {[
                { key: "name", label: "Business", icon: FiPackage },
                { key: "location", label: "Location", icon: FiMapPin },
                { key: "category", label: "Category", icon: FiTag },
                { key: "contact", label: "Contact", icon: FiPhone },
                { key: "createdAt", label: "Added", icon: FiCalendar },
                { key: "pros", label: "Pros", icon: FiTag },
                { key: "cons", label: "Cons", icon: FiTag },
                { key: "note", label: "Note", icon: FiTag },
              ].map(({ key, label, icon: Icon }) => (
                <th
                  key={key}
                  className="py-4 px-6 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="text-blue-500" />
                    <span>{label}</span>
                    <FiChevronDown
                      className={`ml-1 transition-transform duration-200 ${
                        sortConfig.key === key
                          ? sortConfig.direction === "ascending"
                            ? "rotate-180"
                            : "rotate-0"
                          : "opacity-0"
                      }`}
                    />
                  </div>
                </th>
              ))}
              <th className="py-4 px-6 text-center text-xs font-semibold text-blue-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            <AnimatePresence>
              {sortedRetailers.map((retailer) => (
                <motion.tr
                  layout
                  key={retailer.id}
                  className="group hover:bg-blue-50 transition-colors duration-150"
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <td
                    className="py-4 px-6 text-sm font-medium text-gray-800 cursor-pointer"
                    onClick={() => toggleRowExpansion(retailer.id)}
                  >
                    <div className="flex items-center">
                      {retailer.name}
                      <motion.div
                        animate={{
                          rotate: expandedRows[retailer.id] ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="ml-2"
                      >
                        <FiChevronDown className="text-blue-500" />
                      </motion.div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {retailer.location}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {retailer.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {retailer.contact || "—"}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {retailer.createdAt ? (
                      <span className="text-gray-600">
                        {formatDate(retailer.createdAt)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {retailer.pros || "—"}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {retailer.cons || "—"}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {retailer.note || "—"}
                  </td>
                  <td className="py-4 px-6 text-center space-x-2">
                    <motion.div
                      className="inline-flex space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* <motion.button
                        whileHover={{
                          scale: 1.1,
                          rotate: 3,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          },
                        }}
                        whileTap={{
                          scale: 0.95,
                          rotate: 0,
                          transition: { duration: 0.1 },
                        }}
                        onClick={() => {
                          const confirmation = window.prompt(
                            "Give authentication text to confirm editing of this retailer."
                          );
                          if (confirmation === "ami gay") {
                            onEditRetailer(retailer);
                            toast.success("Retailer ready for editing!");
                          } else {
                            toast.warning(
                              "Retailer not edited. Confirmation did not match."
                            );
                          }
                        }}
                        className="group relative inline-flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
                      >
                        <FiEdit3 className="text-white transition-transform duration-300 group-hover:rotate-12" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Edit
                        </span>
                      </motion.button> */}

                      <motion.button
                        whileHover={{
                          scale: 1.1,
                          rotate: -3,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          },
                        }}
                        whileTap={{
                          scale: 0.95,
                          rotate: 0,
                          transition: { duration: 0.1 },
                        }}
                        onClick={() => {
                          const confirmation = window.prompt(
                            "Give authentication text to confirm deletion of this retailer."
                          );
                          if (confirmation === "ami gay") {
                            onDeleteRetailer(retailer._id);
                            toast.success("Retailer deleted successfully!");
                          } else {
                            toast.warning(
                              "Retailer not deleted. Confirmation did not match."
                            );
                          }
                        }}
                        className="group relative inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
                      >
                        <FiTrash2 className="text-white transition-transform duration-300 group-hover:rotate-6" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Delete
                        </span>
                      </motion.button>
                    </motion.div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
