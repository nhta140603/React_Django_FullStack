import React from "react";

export default function DataTable({
  columns = [],
  data = [],
  actions = [],
  rowSelection = false,
  selectedRowIds = [],
  onSelectionChange = () => {},
}) {
  const allSelected =
    data.length > 0 && data.every((row) => selectedRowIds.includes(row.id));
  const someSelected =
    data.length > 0 &&
    data.some((row) => selectedRowIds.includes(row.id)) &&
    !allSelected;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(data.map((row) => row.id));
    } else {
      onSelectionChange([]);
    }
  };

  return (
    <div className="overflow-x-auto rounded-b-2xl shadow-lg bg-white border-cyan-100">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-cyan-700 to-cyan-400 text-white">
            {rowSelection && (
              <th className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold tracking-wide border-b border-cyan-200 ${col.headerClassName || ""}`}
              >
                {col.title}
              </th>
            ))}
            {actions.length > 0 && <th>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length +
                  (rowSelection ? 1 : 0) +
                  (actions.length > 0 ? 1 : 0)
                }
                className="text-center py-10 text-gray-400"
              >
                Chưa có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="hover:bg-cyan-50 transition border-b border-gray-100 last:border-none"
              >
                {rowSelection && (
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRowIds.includes(row.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelectionChange([...selectedRowIds, row.id]);
                        } else {
                          onSelectionChange(
                            selectedRowIds.filter((id) => id !== row.id)
                          );
                        }
                      }}
                      aria-label="Select row"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 align-middle ${col.className || ""}`}
                  >
                    {col.render ? col.render(row) : row[col.dataIndex]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      {actions.map((action) => (
                        <button
                          key={action.key}
                          onClick={() => action.onClick(row)}
                          className={`p-2 rounded-full hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition ${action.className || ""}`}
                          title={action.title}
                        >
                          {typeof action.icon === "function"
                            ? action.icon(row)
                            : action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}