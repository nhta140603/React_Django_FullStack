import React, { useState, useEffect } from "react";
import { createItem, getDetail, updateItem, uploadImageToServer } from "../../api/api_generics";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { FaCalendarAlt, FaNewspaper, FaSave, FaTimes, FaImage, FaLink, FaEye, FaChevronLeft } from "react-icons/fa";
import { format } from "date-fns";

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'color', 'background',
  'list', 'indent', 'align',
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
          toast.success("Đã tải ảnh lên thành công");
          const quill = this.quill;
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url);
          quill.setSelection(range.index + 1);
        } catch (e) {
          toast.dismiss("uploading");
          toast.error("Lỗi upload ảnh!");
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

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

  const previewArticle = () => {
    setShowPreview(!showPreview);
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
      <p className="text-gray-600 text-lg">Đang tải dữ liệu bài viết...</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

      {showPreview ? (
        <div className="max-w-5xl mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <button
              onClick={() => setShowPreview(false)}
              className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaChevronLeft className="mr-1" /> Quay lại chỉnh sửa
            </button>

            {previewImage && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img src={previewImage} alt={formData.title} className="w-full h-64 object-cover" />
              </div>
            )}

            <div className="flex items-center mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${formData.type === "news" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                }`}>
                {formData.type === "news" ? "Tin tức" : "Sự kiện"}
              </span>

              {formData.type === "event" && formData.event_date && (
                <span className="ml-3 text-sm text-gray-600 flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  {new Date(formData.event_date).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">{formData.title}</h1>

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }}></div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-5">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">Thông tin cơ bản</h2>

                  <div className="mb-5">
                    <label className="block font-medium text-sm text-gray-700 mb-2">Loại bài viết</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: "news" }))}
                        className={`py-2.5 px-3 rounded-md flex items-center justify-center transition-all duration-200 ${formData.type === "news"
                          ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        <FaNewspaper className="mr-2" /> Tin tức
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: "event" }))}
                        className={`py-2.5 px-3 rounded-md flex items-center justify-center transition-all duration-200 ${formData.type === "event"
                          ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        <FaCalendarAlt className="mr-2" /> Sự kiện
                      </button>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label htmlFor="title" className="block font-medium text-sm text-gray-700 mb-2">Tiêu đề</label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Nhập tiêu đề bài viết"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="slug" className="block font-medium text-sm text-gray-700">Đường dẫn (Slug)</label>
                      <div className="text-xs text-gray-500 flex items-center">
                        <FaLink className="mr-1" /> Tự động tạo
                      </div>
                    </div>
                    <input
                      id="slug"
                      type="text"
                      name="slug"
                      disabled
                      value={formData.slug}
                      className="w-full border border-gray-200 rounded-md py-2.5 px-3 bg-gray-50 cursor-not-allowed text-gray-600"
                      placeholder="tieu-de-bai-viet (để trống sẽ tự tạo)"
                    />
                    <p className="text-xs text-gray-500 mt-1.5 italic">
                      Đường dẫn: /{formData.type === "news" ? "tin-tuc" : "su-kien"}/{formData.slug || "slug-tu-dong"}
                    </p>
                  </div>

                  <div className="mb-5">
                    <label className="block font-medium text-sm text-gray-700 mb-2">Ảnh bìa</label>
                    <div className="mt-1 flex items-center">
                      <label className="cursor-pointer flex items-center justify-center border border-gray-300 rounded-md py-2.5 px-4 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200">
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
                          className="ml-3 text-sm text-red-500 hover:text-red-700 transition duration-200"
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

                    {previewImage ? (
                      <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition duration-200 flex items-center justify-center">
                          <label className="cursor-pointer bg-white rounded-full p-2 shadow-md">
                            <FaImage className="text-gray-700" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                        <FaImage className="text-gray-400 text-3xl mb-2" />
                        <p className="text-sm text-gray-500 text-center">Kéo và thả ảnh hoặc nhấn vào nút "Chọn ảnh"</p>
                      </div>
                    )}
                  </div>

                  {formData.type === "event" && (
                    <div className="mb-5">
                      <label htmlFor="event_date" className="block font-medium text-sm text-gray-700 mb-2">
                        Ngày diễn ra sự kiện
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaCalendarAlt className="text-gray-500" />
                        </div>
                        <input
                          id="event_date"
                          type="datetime-local"
                          name="event_date"
                          value={formData.event_date || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">Nội dung bài viết</h2>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    className="bg-white h-[600px] mb-12 rounded-md"
                    modules={modules}
                    formats={formats}
                    placeholder="Nhập nội dung chi tiết cho bài viết, có thể chèn ảnh, bảng, tiêu đề, v.v."
                  />
                </div>
              </div>

            </div>
            <div className="sticky bottom-0 bg-white border-1 border-gray-200 z-30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => navigate("/articles")}
                      className="mr-3 text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <FaChevronLeft className="text-lg" />
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                    </h1>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={previewArticle}
                      className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-md flex items-center hover:bg-indigo-100 transition duration-200"
                    >
                      <FaEye className="mr-1.5" /> Xem trước
                    </button>

                    <button
                      type="button"
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center transition duration-200"
                      onClick={() => navigate("/articles")}
                      disabled={saving}
                    >
                      <FaTimes className="mr-1.5" /> Hủy
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      className={`bg-blue-600 text-white px-4 py-2 rounded-md flex items-center ${saving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                        } transition duration-200`}
                      disabled={saving}
                    >
                      <FaSave className="mr-1.5" />
                      {saving ? "Đang lưu..." : isEditMode ? "Cập nhật bài viết" : "Tạo bài viết mới"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <>
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
      </>
    </div>

  );
}