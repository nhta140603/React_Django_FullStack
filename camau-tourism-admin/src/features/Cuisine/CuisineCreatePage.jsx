import React, { useState, useEffect, useCallback } from "react";
import { createItem, getDetail, updateItem, uploadImageToServer } from "../../api/api_generics";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { FaSave, FaTimes, FaImage, FaEye, FaEyeSlash, FaArrowLeft, FaExclamationCircle, FaCheckCircle, FaDesktop, FaMobileAlt, FaRegEdit, FaUpload, FaTrashAlt, FaExternalLinkAlt } from "react-icons/fa";

const imageHandler = function () {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();
  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      try {
        toast.info("Đang tải ảnh lên...", { autoClose: false, toastId: "uploading" });
        const url = await uploadImageToServer(file);
        toast.dismiss("uploading");
        toast.success("Tải ảnh thành công!");
        const quill = this.quill;
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", url);
        quill.setSelection(range.index + 1);
      } catch (e) {
        toast.dismiss("uploading");
        toast.error("Lỗi khi tải ảnh! Vui lòng thử lại.");
      }
    }
  };
};

const modules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
      ['table'],
    ],
    handlers: {
      image: imageHandler,
    }
  }
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'color', 'background',
  'list', 'bullet', 'indent', 'align',
  'link', 'image', 'video', 'clean'
];

export default function CuisineEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    gallery: [],
    is_public: true,
    slug: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [previewGallery, setPreviewGallery] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [devicePreview, setDevicePreview] = useState("desktop");
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      getDetail("cuisines", id)
        .then(data => {
          const formattedData = {
            name: data.name || "",
            description: data.description || "",
            image: null,
            gallery: [],
            is_public: data.is_public ?? true,
            slug: data.slug || "",
          };

          setFormData(formattedData);
          setOriginalData(formattedData);
          setPreviewImage(data.image || "");
          setPreviewGallery(data.gallery || []);
        })
        .catch(() => {
          toast.error("Không tìm thấy món ăn!");
          setTimeout(() => navigate("/cuisines"), 1500);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isEditMode, navigate]);

  // Check for unsaved changes
  useEffect(() => {
    if (isEditMode && originalData.name) {
      const hasChanged =
        formData.name !== originalData.name ||
        formData.description !== originalData.description ||
        formData.is_public !== originalData.is_public ||
        formData.image !== null ||
        formData.gallery.length > 0;

      setHasChanges(hasChanged);
    } else if (!isEditMode) {
      // For new items, check if user has started filling the form
      setHasChanges(
        formData.name !== "" ||
        formData.description !== "" ||
        formData.image !== null ||
        formData.gallery.length > 0
      );
    }
  }, [formData, originalData, isEditMode]);

  // Warn about unsaved changes when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const slugify = useCallback((str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Tên món ăn không được để trống";
    }

    if (formData.name.length > 100) {
      errors.name = "Tên món ăn không được vượt quá 100 ký tự";
    }

    if (!formData.description.trim()) {
      errors.description = "Mô tả không được để trống";
    }

    if (!previewImage && !formData.image) {
      errors.image = "Vui lòng thêm ảnh đại diện";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "name") {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: slugify(value)
      }));
    } else if (name === "is_public") {
      setFormData(prev => ({
        ...prev,
        is_public: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleDescriptionChange = (description) => {
    setFormData(prev => ({
      ...prev,
      description
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB");
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormErrors(prev => ({ ...prev, image: null }));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.warning(`${oversizedFiles.length} ảnh có kích thước quá lớn. Vui lòng chọn ảnh dưới 5MB`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...files],
    }));

    const previews = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then(images =>
      setPreviewGallery(prev => [...prev, ...images])
    );
  };

  const handleRemoveGalleryImage = idx => {
    setPreviewGallery(prev => prev.filter((_, i) => i !== idx));
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== idx)
    }));
  };

  const handleRemoveMainImage = () => {
    setPreviewImage("");
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("description", formData.description);
      payload.append("is_public", formData.is_public ? "true" : "false");
      payload.append("slug", formData.slug);

      if (formData.image) {
        payload.append("image", formData.image);
      }

      if (formData.gallery && formData.gallery.length > 0) {
        formData.gallery.forEach((file) => {
          payload.append(`gallery`, file);
        });
      }

      if (isEditMode) {
        await updateItem("cuisines", id, payload, true);
        toast.success("Cập nhật món ăn thành công!");
      } else {
        await createItem("cuisines", payload, true);
        toast.success("Tạo món ăn mới thành công!");
      }

      setTimeout(() => navigate(`/cuisines`), 1200);
    } catch (error) {
      console.error(error);
      toast.error(isEditMode
        ? "Có lỗi khi cập nhật món ăn! Vui lòng thử lại."
        : "Có lỗi khi tạo món ăn mới! Vui lòng thử lại."
      );
    } finally {
      setSaving(false);
    }
  };

  const DescriptionPreview = () => (
    <div className={`bg-white rounded-lg shadow p-6 description-preview 
      ${devicePreview === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}`}>
      <h2 className="text-xl font-semibold mb-3 pb-2 border-b">Xem trước mô tả</h2>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.description }} />
    </div>
  );

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600">Đang tải thông tin món ăn...</p>
    </div>
  );

  if (previewMode) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Quay lại chỉnh sửa
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDevicePreview("desktop")}
              className={`p-2 rounded ${devicePreview === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              title="Xem như máy tính"
            >
              <FaDesktop />
            </button>
            <button
              onClick={() => setDevicePreview("mobile")}
              className={`p-2 rounded ${devicePreview === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              title="Xem như điện thoại"
            >
              <FaMobileAlt />
            </button>
          </div>
        </div>

        <div className={devicePreview === 'mobile' ? 'max-w-sm mx-auto' : ''}>
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h1 className="text-xl font-bold">
                {formData.name || "Tên món ăn chưa được đặt"}
              </h1>
              {!formData.is_public && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <FaEyeSlash className="mr-1" /> Chưa công khai
                </span>
              )}
            </div>

            {previewImage ? (
              <img src={previewImage} alt={formData.name} className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                <span>Chưa có ảnh đại diện</span>
              </div>
            )}

            <div className="p-6">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.description }} />
            </div>

            {previewGallery.length > 0 && (
              <div className="px-6 pb-6">
                <h3 className="font-medium text-lg mb-3">Bộ sưu tập ảnh</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {previewGallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Ảnh ${idx + 1}`}
                      className="rounded-lg object-cover w-full h-32"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className={`bg-blue-600 text-white px-4 py-2.5 rounded-md flex items-center ${saving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
            disabled={saving}
          >
            <FaSave className="mr-2" />
            {saving ? "Đang lưu..." : isEditMode ? "Cập nhật món ăn" : "Tạo món ăn mới"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            type="button"
            className="mr-3 text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/cuisines")}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Chỉnh sửa món ăn" : "Tạo món ăn mới"}
          </h1>
        </div>
        <div className="flex space-x-2">
          {hasChanges && (
            <div className="flex items-center text-amber-600 mr-2">
              <FaExclamationCircle className="mr-1" /> Chưa lưu
            </div>
          )}
          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center"
            onClick={() => setPreviewMode(true)}
          >
            <FaEye className="mr-2" /> Xem trước
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4 bg-white p-6 rounded-lg shadow">
            <div className="relative">
              <div className="flex justify-between">
                <label className="block font-medium mb-1">Tên món ăn <span className="text-red-500">*</span></label>
                {formErrors.name && (
                  <span className="text-red-500 text-xs italic">{formErrors.name}</span>
                )}
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md p-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Nhập tên món ăn"
                maxLength={100}
              />
              <div className="text-xs text-gray-500 mt-1 flex justify-end">
                {formData.name.length}/100 ký tự
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Đường dẫn (tự động)</label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  readOnly
                  className="w-full border rounded-md py-2 px-3 bg-gray-100 text-gray-700"
                  placeholder="ten-mon-an"
                />
                <button
                  type="button"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  title="Copy đường dẫn"
                  onClick={() => {
                    navigator.clipboard.writeText(`/am-thuc/${formData.slug}`);
                    toast.info("Đã sao chép đường dẫn!");
                  }}
                >
                  <FaExternalLinkAlt />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Đường dẫn: /am-thuc/{formData.slug || "slug-tu-dong"}
              </p>
            </div>

            <div>
              <div className="flex justify-between">
                <label className="block font-medium mb-1">Ảnh đại diện <span className="text-red-500">*</span></label>
                {formErrors.image && (
                  <span className="text-red-500 text-xs italic">{formErrors.image}</span>
                )}
              </div>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center ${formErrors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-500'
                } transition-colors`}>
                {previewImage ? (
                  <div className="relative">
                    <img src={previewImage} alt="Preview" className="mx-auto h-44 object-contain" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex justify-center items-center transition-all opacity-0 hover:opacity-100">
                      <button
                        type="button"
                        className="bg-white text-red-500 p-2 rounded-full hover:bg-red-100"
                        onClick={handleRemoveMainImage}
                        title="Xóa ảnh"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <FaImage className="text-gray-400 text-4xl mb-2" />
                    <p className="text-gray-500 mb-2">Chọn ảnh đại diện</p>
                    <label className="cursor-pointer inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">
                      <FaUpload className="mr-1" /> Tải ảnh lên
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF (tối đa 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Bộ sưu tập ảnh</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center border-gray-300 hover:border-blue-500 transition-colors">
                {previewGallery.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {previewGallery.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Gallery ${idx}`}
                            className="rounded-md object-cover h-20 w-full"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex justify-center items-center transition-all opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              className="bg-white text-red-500 p-1 rounded-full hover:bg-red-100"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              title="Xóa ảnh"
                            >
                              <FaTrashAlt size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <label className="cursor-pointer inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">
                      <FaUpload className="mr-1" /> Thêm ảnh khác
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleGalleryChange}
                      />
                    </label>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <FaImage className="text-gray-400 text-2xl mb-2" />
                    <p className="text-gray-500 mb-2">Thêm nhiều ảnh để hiển thị trong bộ sưu tập</p>
                    <label className="cursor-pointer inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">
                      <FaUpload className="mr-1" /> Tải ảnh lên
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleGalleryChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium mt-2 cursor-pointer hover:text-blue-600">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={!!formData.is_public}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-1">
                  {formData.is_public ? (
                    <>
                      <FaEye className="text-green-500" />
                      <span>Hiển thị công khai</span>
                    </>
                  ) : (
                    <>
                      <FaEyeSlash className="text-gray-400" />
                      <span>Ẩn khỏi công khai</span>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                {formErrors.description && (
                  <span className="text-red-500 text-xs italic">{formErrors.description}</span>
                )}
              </div>

              <div className={isDescriptionFocused ? "grid grid-cols-2 gap-4" : ""}>
                <div className={isDescriptionFocused ? "" : "w-full"}>
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    formats={formats}
                    className="bg-white quill-editor"
                    placeholder="Nhập mô tả chi tiết cho món ăn, có thể chèn ảnh, bảng, tiêu đề, v.v."
                    style={{ minHeight: "400px" }}
                  />
                </div>

                {isDescriptionFocused && (
                  <div className="border rounded-lg overflow-auto h-[400px]">
                    <DescriptionPreview />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-8 bg-white p-4 rounded-lg shadow sticky bottom-0">
          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-md flex items-center"
            onClick={() => navigate("/cuisines")}
            disabled={saving}
          >
            <FaTimes className="mr-2" /> Hủy
          </button>

          <button
            type="button"
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2.5 rounded-md flex items-center"
            onClick={() => setPreviewMode(true)}
            disabled={saving}
          >
            <FaEye className="mr-2" /> Xem trước
          </button>

          <button
            type="submit"
            className={`bg-blue-600 text-white px-5 py-2.5 rounded-md flex items-center ${saving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                {isEditMode ? "Cập nhật món ăn" : "Tạo món ăn mới"}
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .quill-editor .ql-container {
          min-height: 300px;
          max-height: 500px;
          overflow-y: auto;
        }
      `}</style>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <style>
        {`
          .ql-toolbar.ql-snow {
            position: sticky;
            top: 64px;
            z-index: 20;
            background: #fff;
            border:1
          }
        `}
      </style>
    </div>
  );
}