// RoomHistory.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// import "./RoomHistory.scss";
import {
  Search,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader,
} from "lucide-react";
import apiService from "../../services/api";

const ITEMS_PER_PAGE = 10;

const RoomHistory = ({ roomId }) => {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiService.getRoomHistory(roomId);
        setData(result.data.data);
      } catch (error) {
        console.error("Error fetching room history: ", error);
        setError("Failed to load room history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  // Filter data based on username and date range
  useEffect(() => {
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.time);
      const matchesUsername = username
        ? item.user.toLowerCase().includes(username.toLowerCase())
        : true;
      const matchesDateRange =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);
      return matchesUsername && matchesDateRange;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, username, startDate, endDate]);

  // Update pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset filters
  const handleReset = () => {
    setUsername("");
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const result = await apiService.getRoomHistory(roomId);
      setData(result.data.data);
      setError(null);
    } catch (error) {
      console.error("Error refreshing room history: ", error);
      setError("Failed to refresh data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="room-history container-fluid p-3">
      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <h2 className="card-title h5 mb-0">Room Usage History</h2>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader size={16} className="me-1 animate-spin" />
                ) : (
                  <RefreshCw size={16} className="me-1" />
                )}
                Refresh
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleReset}
                disabled={isLoading}
              >
                <RefreshCw size={16} className="me-1" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Filters */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Search by username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Calendar size={18} />
                  </span>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                    dateFormat="MM/dd/yyyy h:mm aa"
                    className="form-control"
                    placeholderText="Select start date"
                    maxDate={endDate}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="form-label">End Date</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Calendar size={18} />
                  </span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    showTimeSelect
                    dateFormat="MM/dd/yyyy h:mm aa"
                    className="form-control"
                    placeholderText="Select end date"
                    minDate={startDate}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-5">
              <Loader size={32} className="animate-spin text-primary mb-2" />
              <p className="text-muted">Loading room history...</p>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                <div className="text-muted mb-2 mb-md-0">
                  Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
                  {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                  {filteredData.length} entries
                </div>
              </div>

              {/* Data Table */}
              <div className="table-responsive">
                <table className="table table-hover border">
                  <thead>
                    <tr>
                      <th className="bg-light">Username</th>
                      <th className="bg-light">Status</th>
                      <th className="bg-light">Time</th>
                      <th className="bg-light">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, index) => {
                      let duration = "";
                      if (
                        item.status === "out" &&
                        index < paginatedData.length - 1
                      ) {
                        const outTime = new Date(item.time);
                        const inTime = new Date(paginatedData[index + 1].time);
                        const diff = outTime - inTime;
                        const minutes = Math.floor(diff / 60000);
                        const seconds = Math.floor((diff % 60000) / 1000);
                        duration = `${minutes}m ${seconds}s`;
                      }

                      return (
                        <tr key={index}>
                          <td className="text-break">
                            <span className="fw-medium">{item.user}</span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === "in"
                                  ? "bg-success-subtle text-success"
                                  : "bg-danger-subtle text-danger"
                              } rounded-pill px-3`}
                            >
                              {item.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-nowrap">
                            {new Date(item.time).toLocaleString()}
                          </td>
                          <td>{duration || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* No Results Message */}
              {filteredData.length === 0 && (
                <div className="alert alert-info">
                  No records found matching the filter criteria.
                </div>
              )}

              {/* Pagination */}
              {filteredData.length > 0 && (
                <nav aria-label="Page navigation" className="mt-4">
                  <ul className="pagination pagination-sm justify-content-center justify-content-md-end flex-wrap">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      >
                        <ChevronLeft size={16} />
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                      >
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomHistory;
