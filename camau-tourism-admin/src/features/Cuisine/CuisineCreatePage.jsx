import React, { useState, useEffect } from "react";
import { createItem, getDetail, updateItem } from "../../api/api_generics";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { FaSave, FaTimes, FaImage, FaEye, FaEyeSlash } from "react-icons/fa";

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
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

  useEffect(() => {
    if (isEditMode) {
      getDetail("cuisines", id)
        .then(data => {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            image: null,
            gallery: [],
            is_public: data.is_public ?? true,
            slug: data.slug || "",
          });
          setPreviewImage(data.image || "");
          setPreviewGallery(data.gallery || []);
        })
        .catch(() => toast.error("Không tìm thấy món ăn!"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

  function slugify(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

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
        [name]: value
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
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      gallery: files,
    }));

    const previews = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then(images => setPreviewGallery(images));
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
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("is_public", formData.is_public ? "true" : "false");
      payload.append("slug", formData.slug);

      if (formData.image) {
        payload.append("image", formData.image);
      }

      if (formData.gallery && formData.gallery.length > 0) {
        formData.gallery.forEach((file, idx) => {
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
      toast.error(isEditMode ? "Có lỗi khi cập nhật món ăn!" : "Có lỗi khi tạo món ăn mới!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-4 max-w-8xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Chỉnh sửa món ăn" : "Tạo món ăn mới"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4 bg-white p-6 rounded-lg shadow">
            <div>
              <label className="block font-medium mb-1">Tên món ăn</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="Nhập tên món ăn"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Slug (tự động)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                disabled
                className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
                placeholder="ten-mon-an"
              />
              <p className="text-xs text-gray-500 mt-1">
                Đường dẫn: /am-thuc/{formData.slug || "slug-tu-dong"}
              </p>
            </div>
            <div>
              <label className="block font-medium mb-1">Ảnh đại diện</label>
              <div className="flex items-center gap-2 mt-1">
                <label className="cursor-pointer flex items-center border border-gray-300 rounded-md py-2 px-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <FaImage className="mr-2" /> Chọn ảnh
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {previewImage && (
                  <button
                    type="button"
                    className="text-red-500 ml-2"
                    onClick={handleRemoveMainImage}
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>
              {previewImage && (
                <div className="mt-2 rounded-md overflow-hidden border border-gray-200">
                  <img src={previewImage} alt="Preview" className="w-full h-40 object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Bộ sưu tập ảnh</label>
              <label className="cursor-pointer flex items-center border border-gray-300 rounded-md py-2 px-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FaImage className="mr-2" /> Thêm nhiều ảnh
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryChange}
                />
              </label>
              {previewGallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {previewGallery.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Gallery ${idx}`} className="rounded-md object-cover h-24 w-full" />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white bg-opacity-70 rounded-bl px-1 text-xs text-red-500"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        title="Xóa"
                      >X</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 font-medium mt-2">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={!!formData.is_public}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                {formData.is_public ? (
                  <>
                    <FaEye className="text-green-500" /> Hiển thị công khai
                  </>
                ) : (
                  <>
                    <FaEyeSlash className="text-gray-400" /> Ẩn khỏi công khai
                  </>
                )}
              </label>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block font-medium mb-3">Mô tả chi tiết</label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={handleDescriptionChange}
                modules={modules}
                formats={formats}
                className="bg-white h-[350px] mb-8"
                placeholder="Nhập mô tả chi tiết cho món ăn, có thể chèn ảnh, bảng, tiêu đề, v.v."
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-md flex items-center"
            onClick={() => navigate("/cuisines")}
            disabled={saving}
          >
            <FaTimes className="mr-2" /> Hủy
          </button>
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2.5 rounded-md flex items-center ${saving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            disabled={saving}
          >
            <FaSave className="mr-2" />
            {saving ? "Đang lưu..." : isEditMode ? "Cập nhật món ăn" : "Tạo món ăn mới"}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}