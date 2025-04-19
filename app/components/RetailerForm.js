"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiSave,
  FiUser,
  FiMapPin,
  FiTag,
  FiPhone,
  FiMap,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";

export default function ModernRetailerForm({ onAddRetailer }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    contact: "",
    note: "",
    pros: "",
    cons: "",
    addedBy: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ["name", "location", "category", "addedBy"];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    if (formData.addedBy.trim() !== "ami gay") {
      errors.addedBy = "Authentication failed";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { addedBy, ...cleanedData } = formData;
      onAddRetailer(cleanedData);

      setFormData({
        name: "",
        location: "",
        category: "",
        contact: "",
        note: "",
        pros: "",
        cons: "",
        addedBy: "",
      });

      setIsOpen(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.95 },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="relative mb-8">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="addButton"
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 group"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiPlus className="text-xl group-hover:rotate-180 transition-transform duration-300" />
            <span>Add New Retailer</span>
          </motion.button>
        ) : (
          <motion.div
            key="formContainer"
            className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-blue-100 relative"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <motion.h2
                  className="text-3xl font-bold text-gray-800 flex items-center gap-3"
                  variants={inputVariants}
                >
                  <FiUser className="text-blue-600" />
                  Add New Retailer
                </motion.h2>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FiX className="text-xl" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      id: "name",
                      icon: <FiUser />,
                      label: "Business Name *",
                      placeholder: "Enter business name",
                    },
                    {
                      id: "location",
                      icon: <FiMapPin />,
                      label: "Location *",
                      placeholder: "City, State or Address",
                    },
                    {
                      id: "category",
                      icon: <FiTag />,
                      label: "Category *",
                      placeholder: "e.g. Grocery, Electronics",
                    },
                    {
                      id: "contact",
                      icon: <FiPhone />,
                      label: "Contact",
                      placeholder: "Phone or Email (Optional)",
                    },

                    {
                      id: "note",
                      icon: <FiInfo />,
                      label: "Note",
                      placeholder: "Add note or description",
                    },
                    {
                      id: "addedBy",
                      icon: <FiShield />,
                      label: "Added By (For Auth) *",
                      placeholder: "Type validation phrase",
                      required: true,
                    },
                  ].map(({ id, icon, label, placeholder, required }) => (
                    <motion.div key={id} variants={inputVariants}>
                      <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                        {icon} {label}
                      </label>
                      <input
                        type="text"
                        name={id}
                        id={id}
                        value={formData[id]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        required={required}
                        className={`w-full border rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 transition duration-300 ${
                          formErrors[id]
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                      {formErrors[id] && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs flex items-center gap-1 mt-1"
                        >
                          <FiAlertCircle />
                          {formErrors[id]}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}

                  {/* Pros and Cons Textareas */}
                  <motion.div variants={inputVariants}>
                    <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                      <FiCheckCircle /> Pros
                    </label>
                    <textarea
                      name="pros"
                      rows={3}
                      placeholder="What are the strengths?"
                      value={formData.pros}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </motion.div>

                  <motion.div variants={inputVariants}>
                    <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                      <FiAlertCircle /> Cons
                    </label>
                    <textarea
                      name="cons"
                      rows={3}
                      placeholder="What are the weaknesses?"
                      value={formData.cons}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    />
                  </motion.div>
                </div>

                <motion.div
                  className="flex justify-end gap-3 mt-8"
                  variants={inputVariants}
                >
                  <motion.button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg flex items-center gap-2 transition-all"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FiX />
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-lg flex items-center gap-2 shadow-md hover:shadow-emerald-500/50 transition-all"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FiSave />
                    Save Retailer
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
