import React, { useEffect, useState } from "react";
import { getDetail, updateItem } from "../../api/api_generics";
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
  'list', 'indent', 'align',
  'link', 'image', 'video',
  'table'
];

export default function FestivalDescriptionEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState("");

  useEffect(() => {
    getDetail("festivals", id)
      .then(data => {
        setFestival(data);
        setDescription(data.description || "");
      })
      .catch(() => toast.error("Không tìm thấy lễ hội!"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateItem("festivals", id, {
        description,
      });
      toast.success("Cập nhật lễ hội thành công!");
      setTimeout(() => navigate(`/festivals`), 1200);
    } catch {
      toast.error("Có lỗi khi cập nhật!");
    }
  };

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (!festival) return <div className="p-4 text-red-500">Không tìm thấy lễ hội</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded shadow p-6 mt-6">
      <h1 className="text-xl font-bold mb-2">Chỉnh sửa lễ hội: {festival.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Mô tả chi tiết</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            className="bg-white"
            style={{ minHeight: 400, height: 400, marginBottom: 24 }}
            modules={modules}
            formats={formats}
            placeholder="Nhập nội dung mô tả chi tiết cho lễ hội"
          />
        </div>
        <div className="flex gap-2 mt-16">
          <button
            type="submit"
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
          >
            Lưu lễ hội
          </button>
          <button
            type="button"
            className="bg-gray-100 px-4 py-2 rounded"
            onClick={() => navigate("/festivals")}
          >
            Hủy
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}