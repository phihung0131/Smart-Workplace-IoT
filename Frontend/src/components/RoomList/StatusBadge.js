import React from "react";
import { Badge } from "react-bootstrap";

const StatusBadge = ({ status }) => {
  const getVariant = (status) => {
    switch (status) {
      case "Trống":
        return "success";
      case "Đang sử dụng":
        return "info";
      case "Có người":
        return "danger";
      default:
        return "secondary";
    }
  };

  return <Badge bg={getVariant(status)}>{status}</Badge>;
};

export default StatusBadge;
