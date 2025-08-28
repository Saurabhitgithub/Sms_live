import React from 'react'
import { exportCsv } from '../../../assets/commonFunction';

export default function ExportCsv({exportData,filName}) {
  return (
    <div>
        <div
            // className="btn export pointer"
            onClick={() => {
              exportCsv(exportData, filName);
              
            }}
          >
          CSV
          </div>
    </div>
  )
}
