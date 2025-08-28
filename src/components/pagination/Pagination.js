import React, { useEffect, useState } from "react";
import Icon from "../icon/Icon";
import { Pagination, PaginationLink, PaginationItem } from "reactstrap";

const PaginationComponent = ({ itemPerPage, totalItems, paginate, currentPage }) => {
  const [pageNumbers, setPageNumbers] = useState([]);
  const totalPages = Math.ceil(totalItems / itemPerPage);
  const maxPagesToShow = 10; // Limit the displayed page numbers to 10

  useEffect(() => {
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const newPageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      newPageNumbers.push(i);
    }

    setPageNumbers(newPageNumbers);
  }, [totalItems, itemPerPage, currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  return (
    <Pagination aria-label="Page navigation example" size="sm">
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink
          className="page-link-prev paginator-btn"
          onClick={(ev) => {
            ev.preventDefault();
            prevPage();
          }}
          href="#prev"
        >
          <Icon name="chevrons-left" />
          <span>Prev</span>
        </PaginationLink>
      </PaginationItem>

      {pageNumbers.map((item) => (
        <PaginationItem className={currentPage === item ? "active" : ""} key={item}>
          <PaginationLink
            tag="a"
            href="#pageitem"
            onClick={(ev) => {
              ev.preventDefault();
              paginate(item);
            }}
          >
            {item}
          </PaginationLink>
        </PaginationItem>
      ))}

      <PaginationItem disabled={currentPage === totalPages}>
        <PaginationLink
          className="page-link-next paginator-btn"
          onClick={(ev) => {
            ev.preventDefault();
            nextPage();
          }}
          href="#next"
        >
          <span>Next</span>
          <Icon name="chevrons-right" />
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  );
};

export default PaginationComponent;
