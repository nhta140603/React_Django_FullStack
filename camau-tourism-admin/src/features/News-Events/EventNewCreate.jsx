import React, { useState, useEffect } from "react";
import { createItem, getDetail, updateItem } from "../../api/api_generics";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { FaCalendarAlt, FaNewspaper, FaSave, FaTimes, FaImage } from "react-icons/fa";

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
    ['table'],
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'color', 'background',
  'list', 'bullet', 'indent', 'align',
  'link', 'image', 'video', 'clean',
  'table'
];

export default function ArticleEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    type: "news",
    title: "",
    slug: "",
    content: "",
    cover_image_url: "",
    event_date: null,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      getDetail("articles", id)
        .then(data => {
          let formattedEventDate = null;
          if (data.event_date) {
            const eventDate = new Date(data.event_date);
            formattedEventDate = format(eventDate, "yyyy-MM-dd'T'HH:mm");
          }

          setFormData({
            type: data.type || "news",
            title: data.title || "",
            slug: data.slug || "",
            content: data.content || "",
            cover_image_url: data.cover_image_url || "",
            event_date: formattedEventDate,
          });

          setPreviewImage(data.cover_image_url || "");
        })
        .catch(() => toast.error("Không tìm thấy bài viết!"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === "title") {
        return {
          ...prev,
          title: value,
          slug: slugify(value)
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          cover_image_url: file 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  function slugify(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
  
    try {
      const payload = new FormData();
      payload.append("type", formData.type);
      payload.append("title", formData.title);
      payload.append("slug", formData.slug || "");
      payload.append("content", formData.content);
  
      if (formData.type === "event" && formData.event_date) {
        payload.append("event_date", formData.event_date);
      }
  
      if (formData.cover_image_url) {
        payload.append("cover_image_url", formData.cover_image_url);
      }
  
      if (isEditMode) {
        await updateItem("articles", id, payload, true);
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await createItem("articles", payload, true);
        toast.success("Tạo bài viết mới thành công!");
      }
  
      setTimeout(() => navigate(`/articles`), 1200);
    } catch (error) {
      console.error(error);
      toast.error(isEditMode ? "Có lỗi khi cập nhật bài viết!" : "Có lỗi khi tạo bài viết mới!");
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4 bg-white p-6 rounded-lg shadow">
            <div>
              <label className="block font-medium mb-1">Loại bài viết</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: "news" }))}
                  className={`py-2 px-3 rounded-md flex items-center justify-center ${formData.type === "news"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200"
                    }`}
                >
                  <FaNewspaper className="mr-2" /> Tin tức
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: "event" }))}
                  className={`py-2 px-3 rounded-md flex items-center justify-center ${formData.type === "event"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200"
                    }`}
                >
                  <FaCalendarAlt className="mr-2" /> Sự kiện
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Tiêu đề</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Đường dẫn (Slug)</label>
              <input
                type="text"
                name="slug"
                disabled
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
                placeholder="tieu-de-bai-viet (để trống sẽ tự tạo)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Định dạng URL: /{formData.type === "news" ? "tin-tuc" : "su-kien"}/{formData.slug || "slug-tu-dong"}
              </p>
            </div>

            <div>
              <label className="block font-medium mb-1">Ảnh bìa</label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer flex items-center justify-center border border-gray-300 rounded-md py-2 px-3 bg-white text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                  <FaImage className="mr-2" /> Chọn ảnh
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                {previewImage && (
                  <button
                    type="button"
                    className="ml-2 text-sm text-red-500"
                    onClick={() => {
                      setPreviewImage("");
                      setFormData(prev => ({
                        ...prev,
                        cover_image_file: null,
                        cover_image_url: ""
                      }));
                    }}
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>

              {previewImage && (
                <div className="mt-2 relative rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>

            {formData.type === "event" && (
              <div>
                <label className="block font-medium mb-1">Ngày diễn ra sự kiện</label>
                <input
                  type="datetime-local"
                  name="event_date"
                  value={formData.event_date || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block font-medium mb-3">Nội dung</label>
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                className="bg-white h-[500px] mb-12"
                modules={modules}
                formats={formats}
                placeholder="Nhập nội dung chi tiết cho bài viết, có thể chèn ảnh, bảng, tiêu đề, v.v."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-md flex items-center"
            onClick={() => navigate("/articles")}
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
            {saving ? "Đang lưu..." : isEditMode ? "Cập nhật bài viết" : "Tạo bài viết mới"}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}