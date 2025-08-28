import React from 'react'
import style from './BorderedTable.module.css'

export const BorderedTable = ({ children }) => {
    return (
        <div className={style.borderedTable_main_con}>{children}</div>
    )
}
