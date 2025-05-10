import React, { useEffect, useState } from "react";
import { getDetail, getList, updateItem } from "../../api/api_generics";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
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
export default function DestinationDescriptionEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDetail("destinations", id)
      .then(data => {
        console.log("Data:", data);
        setDestination(data);
        setDescription(data.description || "");
      })
      .catch(() => toast.error("Không tìm thấy địa điểm!"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateItem("destinations", id, { description });
      toast.success("Cập nhật mô tả thành công!");
      setTimeout(() => navigate(`/destinations`), 1200);
    } catch {
      toast.error("Có lỗi khi cập nhật!");
    }
  };

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (!destination) return <div className="p-4 text-red-500">Không tìm thấy địa điểm</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded shadow p-6 mt-6">
      <h1 className="text-xl font-bold mb-2">Chỉnh sửa mô tả: {destination.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Mô tả</label>
          {!loading && (
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              className="bg-white"
              style={{ minHeight: 400, height: 400, marginBottom: 24 }}
              modules={modules}
              formats={formats}
              placeholder="Nhập nội dung mô tả chi tiết cho địa điểm, có thể chèn ảnh, bảng, tiêu đề, v.v."
            />
          )}
        </div>
        <div className="flex gap-2 mt-16">
          <button
            type="submit"
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
          >
            Lưu mô tả
          </button>
          <button
            type="button"
            className="bg-gray-100 px-4 py-2 rounded"
            onClick={() => navigate("/destinations")}
          >
            Hủy
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}