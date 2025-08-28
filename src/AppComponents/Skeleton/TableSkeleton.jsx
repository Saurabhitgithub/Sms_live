import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <table>
      <thead>
        <tr>
          {Array(columns).fill(0).map((_, index) => (
            <th className='p-2' key={index}><Skeleton height={40} /></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array(rows).fill(0).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array(columns).fill(0).map((_, colIndex) => (
              <td className='p-2' key={colIndex}><Skeleton height={40} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableSkeleton;
