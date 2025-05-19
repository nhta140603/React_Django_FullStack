import React, { useEffect, useState, useCallback } from "react";
import { getDetail, updateItem, uploadImageToServer } from "../../api/api_generics";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";

export default function TourDescriptionEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [description, setDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const imageHandler = useCallback(function () {
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
          const quill = this.quill;
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url);
          quill.setSelection(range.index + 1);
          toast.dismiss("uploading");
          toast.success("Tải ảnh thành công!");
        } catch (e) {
          toast.dismiss("uploading");
          toast.error("Lỗi upload ảnh! Vui lòng thử lại.");
        }
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      }
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'align',
    'link', 'image',
  ];

  useEffect(() => {
    getDetail("tours", id)
      .then(data => {
        setTour(data);
        setDescription(data.description || "");
        setOriginalDescription(data.description || "");
      })
      .catch(() => toast.error("Không tìm thấy địa điểm!"))
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    setHasChanges(description !== originalDescription);
  }, [description, originalDescription]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời đi?";
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  function optimizeCloudinaryUrls(html) {
    if (!html) return html;
    return html.replace(
      /https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?!.*f_auto,q_auto.*\/)/g,
      'https://res.cloudinary.com/$1/image/upload/f_auto,q_auto/'
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu");
      return;
    }

    setSaving(true);
    try {
      const optimizedDescription = optimizeCloudinaryUrls(description);
      await updateItem("tours", id, { description: optimizedDescription });
      toast.success("Cập nhật mô tả thành công!");
      setOriginalDescription(description);
      setHasChanges(false);
      setTimeout(() => navigate(`/tours`), 1500);
    } catch (error) {
      toast.error("Có lỗi khi cập nhật! Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("Bạn có thay đổi chưa được lưu. Bạn có chắc muốn hủy?")) {
        navigate("/tours");
      }
    } else {
      navigate("/tours");
    }
  };

  const handleRestore = () => {
    if (window.confirm("Bạn có chắc muốn khôi phục về nội dung ban đầu?")) {
      setDescription(originalDescription);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
    </div>
  );

  if (!tour) return (
    <div className="max-w-6xl mx-auto p-6 mt-6">
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Không tìm thấy địa điểm</span>
      </div>
      <button
        onClick={() => navigate("/tours")}
        className="mt-4 text-cyan-600 hover:text-cyan-800 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
        Quay lại danh sách
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{tour.name}</h1>
          <p className="text-gray-600">Chỉnh sửa mô tả chi tiết</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex h-3 w-3 rounded-full ${hasChanges ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
          <span className="text-sm text-gray-600">{hasChanges ? 'Có thay đổi chưa lưu' : 'Đã lưu'}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-6 flex items-center justify-between">
        <div className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Chỉnh sửa mô tả chi tiết cho tour, có thể chèn hình ảnh và định dạng văn bản</span>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-800"
          >
            {previewMode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Chế độ chỉnh sửa
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Xem trước
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          {previewMode ? (
            <div className="border rounded-lg p-6 min-h-[400px] bg-white prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          ) : (
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              className="bg-white rounded-lg"
              style={{ minHeight: 400, marginBottom: 50 }}
              modules={modules}
              formats={formats}
              placeholder="Nhập nội dung mô tả chi tiết cho tour..."
            />
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-8 border-t">
          <button
            type="submit"
            disabled={saving || !hasChanges}
            className={`inline-flex items-center px-4 py-2 rounded-md ${hasChanges ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              } transition-colors duration-200`}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lưu...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Lưu thay đổi
              </>
            )}
          </button>

          {hasChanges && (
            <button
              type="button"
              onClick={handleRestore}
              className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Khôi phục
            </button>
          )}

          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Hủy
          </button>
        </div>
      </form>

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