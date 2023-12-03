import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";

const Admin = () => {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({ name: "", email: "", role: "" });

  const itemsPerPage = 10;
  useEffect(() => {
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);
        console.log(data);
      })
  }, [])

  const handleDelete = (id) => {
    const updatedRows = users.filter(user => user.id !== id);

    setUsers(updatedRows);
    setFilteredUsers(updatedRows);

  }

  const handleSearch = (e) => {
    const filteredRows = users.filter(user =>
      Object.values(user).some(value =>
        value.toString().toLowerCase().includes(e.target.value.toLowerCase())
      )
    )

    setFilteredUsers(filteredRows);
  }

  const handleSelected = () => {
    const updatedRows = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedRows);
    setFilteredUsers(updatedRows);
    setSelectedRows([]);
    setCurrentPage(1);

  }

  const handlePageChange = page => {
    setCurrentPage(page);
    setEditingRow(null);
  };

  const handleSelectAllRows = () => {

     const allRowsSelected = filteredUsers.length > 0 && selectedRows.length === filteredUsers.length;

    const newSelectedRows = allRowsSelected
      ? []
      : [
        ...selectedRows,
        ...filteredUsers
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map(user => user.id)
          .filter(id => !selectedRows.includes(id)),
      ];

    setSelectedRows(newSelectedRows);
  };

  const handleRowSelect = id => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(newSelectedRows);
  };


  const handleEditRow = (id, name, email, role) => {
    setEditingRow(id);
    setEditedValues({ name, email, role });
  };

  const handleSaveEdit = (id) => {
    setEditingRow(null);

    // Update the user with the edited values
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, ...editedValues } : user
    );

    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleInputChange = (field, value) => {
    // Update the edited values when input changes
    setEditedValues(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
  };

  return (

    <div className="admin-dashboard">
      <div className="container">
        <input type="text" placeholder="Search for users..." id="search-input" className="search-text" onChange={handleSearch} />
        <button className="delete-btn" onClick={handleSelected}>Delete Selected</button>
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={filteredUsers.length > 0 && selectedRows.length === itemsPerPage} onChange={handleSelectAllRows} />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>

          </thead>
          <tbody>
            {Object.values(filteredUsers).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((value, index) => (
              <tr key={index} style={{ background: selectedRows.includes(value.id) ? '#ccc' : 'transparent' }}>
                <td>
                  <input type="checkbox" checked={selectedRows.includes(value.id)} onChange={() => handleRowSelect(value.id)} />
                </td>
                <td>
                  {editingRow === value.id ? (
                    <input
                      type="text"
                      value={editedValues.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    value.name
                  )}
                </td>
                <td>
                  {editingRow === value.id ? (
                    <input
                      type="text"
                      value={editedValues.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    value.email
                  )}
                </td>
                <td>
                  {editingRow === value.id ? (
                    <input
                      type="text"
                      value={editedValues.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                    />
                  ) : (
                    value.role
                  )}
                </td>

                <td>
                  {editingRow === value.id ? (
                    <React.Fragment>
                      <button  className="save btn" onClick={() => handleSaveEdit(value.id)}><FaSave size={20}/></button>
                    </React.Fragment>
                  ) : (
                    <button className="edit btn" onClick={() => handleEditRow(value.id, value.name, value.email, value.role)}><FaRegEdit size={20}/></button>
                  )}
                  <button className="delete btn" onClick={() => handleDelete(value.id)}><MdDelete size={20}/></button>
                </td>
              </tr>
            ))}
          </tbody>


        </table>
      </div>
      <div>
        <button className="first-page btn" onClick={() => handlePageChange(1)}>{'<<'}</button>
        <button className="previous-page btn" onClick={() => handlePageChange(currentPage - 1)}>{'<'}</button>
        {Array.from({ length: Math.ceil(users.length / itemsPerPage) }).map((_, index) => (
          <button  className="btn page" key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
        ))}
        <button className="next-page btn" onClick={() => handlePageChange(currentPage + 1)}>{'>'}</button>
        <button className="last-page btn" onClick={() => handlePageChange(Math.ceil(users.length / itemsPerPage))}>{'>>'}</button>
      </div>

    </div>
  )
}

export default Admin;