import React, { useState } from "react";
import ReactQuill from 'react-quill-new';
import "react-quill-new/dist/quill.snow.css";

export default function GenericForm({
  columns = [],
  initialValues = {},
  onSubmit,
  onCancel,
  submitText = "Lưu"
}) {
  const [form, setForm] = useState(initialValues);
  const [filePreviews, setFilePreviews] = useState({});

  const handleFileChange = (key, file) => {
    setForm(f => ({
      ...f,
      [key]: file 
    }));
    if (file && file.type && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviews(prev => ({ ...prev, [key]: e.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreviews(prev => ({ ...prev, [key]: null }));
    }
  };

  const handleChange = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Array.isArray(form.amenities)) {
      form.amenities = [];
    }

    const hasFile = columns.some(
      col =>
        (col.inputType === "file" || col.key === "image_url" || col.key === "image" || col.key === "avatar") &&
        form[col.dataIndex || col.key] instanceof File
    );

    if (hasFile) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(val => formData.append(key, val));
        } else if (value !== undefined && value !== null && !(key === "image_url" && typeof value === "string")) {
          formData.append(key, value);
        }
      });
      onSubmit(formData);
    } else {
      const cleanedForm = { ...form };
      if (typeof cleanedForm.image_url === "string") {
        delete cleanedForm.image_url;
      }
      onSubmit(cleanedForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {columns.filter(col => col.editable !== false).map(col => {
        const key = col.dataIndex || col.key;

        if (col.inputType === "custom" && typeof col.renderInput === "function") {
          return (
            <div key={col.key} className="flex flex-col">
              <label className="font-medium mb-1">{col.title}</label>
              {col.renderInput({
                value: form[key] || [],
                onChange: val => handleChange(key, val)
              })}
            </div>
          );
        }

        if (col.inputType === "file" || key === "image_url" || key === "image" || key === "avatar") {
          return (
            <div key={col.key} className="flex flex-col">
              <label className="font-medium mb-1">{col.title}</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(key, e.target.files[0])}
                className="border px-2 py-1 rounded"
              />
              {filePreviews[key] ? (
                <img src={filePreviews[key]} alt="preview" className="mt-2 h-20" />
              ) : (
                form[key] && typeof form[key] === "string" && (
                  <img src={form[key]} alt="preview" className="mt-2 h-20" />
                )
              )}
            </div>
          );
        }

        if (col.inputType === "richtext") {
          return (
            <div key={col.key} className="mb-4">
              <label className="block font-semibold mb-1">{col.title}</label>
              <ReactQuill
                value={form[col.key] || ""}
                onChange={val => handleChange(col.key, val)}
                theme="snow"
              />
            </div>
          );
        }
        if (typeof col.renderFormItem === "function") {
          return (
            <div key={col.key} className="flex flex-col">
              <label className="font-medium mb-1">{col.title}</label>
              {col.renderFormItem(form[key], val => handleChange(key, val))}
            </div>
          );
        }
        return (
          <div key={col.key} className="flex flex-col">
            <label className="font-medium mb-1">{col.title}</label>
            {col.inputType === "textarea" ? (
              <textarea
                value={form[key] || ""}
                onChange={e => handleChange(key, e.target.value)}
                className="border px-2 py-1 rounded"
              />
            ) : col.inputType === "number" ? (
              <input
                type="number"
                value={form[key] || ""}
                onChange={e => handleChange(key, e.target.value)}
                className="border px-2 py-1 rounded"
              />
            ) : col.inputType === "checkbox" ? (
              <input
                type="checkbox"
                checked={!!form[key]}
                onChange={e => handleChange(key, e.target.checked)}
              />
            ) : col.inputType === "select" ? (
              <select
                value={form[key] || ""}
                onChange={e => handleChange(key, e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="">--- Chọn {col.title} ---</option>
                {col.options && col.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={col.inputType || "text"}
                value={form[key] || ""}
                onChange={e => handleChange(key, e.target.value)}
                className="border px-2 py-1 rounded"
              />
            ) 
            }
          </div>
        );
      })}
      
      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">{submitText}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-300 rounded px-4 py-2">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}