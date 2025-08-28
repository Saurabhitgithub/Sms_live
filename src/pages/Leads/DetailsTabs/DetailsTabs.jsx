import React, { useState } from 'react'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import PersonalDetails from './PersonalDetails'
import AddressDetails from './AddressDetails'
import PlanDetails from './PlanDetails'
import DocumentsDetails from './DocumentsDetails'

export default function DetailsTabs({getDataById,getdataLeads,undoData}) {
    const [activeTab, toggleTab] = useState('0')

    return (
        <>
            <Nav className='mx-md-3 mx-sm-2 mx-1 mt-4 border-bottom'>
                <NavItem className="pr-0">
                    <NavLink
                        className={`text-secondary f-r-16 fw-500 ${activeTab == '0' ? 'activeTab2' : ''} px-md-4 px-sm-3 px-2 pointer`}
                        onClick={() => toggleTab("0")}
                    >
                        Personal
                    </NavLink>
                </NavItem>
                <NavItem className="pr-0">
                    <NavLink
                        className={`text-secondary f-r-16 fw-500 ${activeTab == '1' ? 'activeTab2' : ''} px-md-4 px-sm-3 px-2 pointer`}
                        onClick={() => toggleTab("1")}
                    >
                        Address
                    </NavLink>
                </NavItem>
                <NavItem className="pr-0">
                    <NavLink
                        className={`text-secondary f-r-16 fw-500 ${activeTab == '2' ? 'activeTab2' : ''} px-md-4 px-sm-3 px-2 pointer`}
                        onClick={() => toggleTab("2")}
                    >
                        Plan
                    </NavLink>
                </NavItem>
                <NavItem className="pr-0">
                    <NavLink
                        className={`text-secondary f-r-16 fw-500 ${activeTab == '3' ? 'activeTab2' : ''} px-md-4 px-sm-3 px-2 pointer`}
                        onClick={() => toggleTab("3")}
                    >
                        Documents
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent className='mx-md-3 mx-sm-2 mx-1 mt-4' activeTab={activeTab}>
                <TabPane tabId="0">
                    <PersonalDetails getDataById={getDataById} getdataLeads={getdataLeads}/>
                </TabPane>
                <TabPane tabId="1">
                    <AddressDetails getDataById={getDataById} getdataLeads={getdataLeads}/>
                </TabPane>
                <TabPane tabId="2">
                    <PlanDetails getDataById={getDataById} getdataLeads={getdataLeads} undoData={undoData}/>
                </TabPane>
                <TabPane tabId="3">
                    <DocumentsDetails getDataById={getDataById} getdataLeads={getdataLeads}/>
                </TabPane>
            </TabContent>
        </>
    )
}
