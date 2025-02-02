import React, { useState } from "react";

const CRUDTable = ({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  title,
  addButtonLabel = "Add New",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">{title}</h5>
          <button className="btn btn-primary" onClick={onAdd}>
            <i className="fas fa-plus me-2"></i>
            {addButtonLabel}
          </button>
        </div>

        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item._id}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => onEdit(item)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(item._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CRUDTable;
