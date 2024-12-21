import React from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { logout } from '../../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {VscSignOut} from "react-icons/vsc"
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = () => {

    const {user, loading: profileLoading} = useSelector((state) => state.profile);
    const {loading:authLoading} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);


    if(profileLoading || authLoading){
        return (
            <div className='spinner'></div>
        )
    }



  return (
    <div className='relative flex flex-col min-w-[222px] border-r-[1px] border-r-richblack-700 min-h-[calc(100vh-3.5rem)]
         bg-richblack-800 py-10'>

         <div className='flex flex-col '>
                {
                    sidebarLinks.map((link) => {
                        if(link.type && user?.accountType !== link.type) return null;
                        return (
                            <SidebarLink key={link.id} link={link} iconName={link.icon}/>
                        )
                    })
                }
         </div>

         <div className='mx-auto mt-6 mb-6 h-[1px] w-11/12 bg-richblack-600'></div>

         <div className='flex flex-col'>
            <SidebarLink
                link={{name:"Settings",path:"dashboard/settings"}}
                iconName="VscSettingsGear"
            />

            <button
                onClick={() => setConfirmationModal({
                    text1:"Are you sure?",
                    text2:"You will be logged out of your account.",
                    btn1Text: "Logout",
                    btn2Text:"Cancel",
                    btn1Handler: () => dispatch(logout(navigate)),
                    btn2Handler: () => setConfirmationModal(null),
                })}
                className='text-sm font-medium text-richblack-300 px-8 py-2'
                >
                    <div className='flex items-center gap-x-2'>
                        <VscSignOut className='text-lg'/>
                        Logout
                    </div>
                </button>
         </div>

         
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default Sidebar