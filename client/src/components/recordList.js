import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { FcDeleteDatabase } from "react-icons/fc";
import "../tableStyling.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Record = (props) => (
  <tr>
    <td>{props.record.name}</td>
    <td>{props.record.position}</td>
    <td>{props.record.level}</td>
    <td>
      <Link className="btn btn-secondary" to={`/edit/${props.record._id}`}>
        <FaUserEdit />
        &nbsp; Edit
      </Link>{" "}
      |
      <button
        className="btn btn-danger"
        onClick={() => {
          props.deleteRecord(props.record._id);
        }}
      >
        <FcDeleteDatabase /> Delete
      </button>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5000/record/`);

      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`;
        toast.error(message);
        return;
      }

      const records = await response.json();
      setRecords(records);
    }

    getRecords();

    return;
  }, [records.length]);

  async function deleteRecord(id) {
    const resp = await fetch(`http://localhost:5000/${id}`, {
      method: "DELETE",
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
    if (resp.ok) {
      toast.success("One employee deleted from database", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error("One employee deleted from database");
    }
  }

  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  return (
    <div>
      <h3>Record List</h3>
      <ToastContainer />
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Level</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{recordList()}</tbody>
      </table>
    </div>
  );
}
