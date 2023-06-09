import React, { useEffect, useState } from 'react'
import './UpdateProfile.css'
import Loader from '../Loader/Loader'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import FaceIcon from '@mui/icons-material/Face'
import {useDispatch, useSelector} from 'react-redux'
import {  clearError, updateProfile } from '../../actions/profileAction'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { loadUser } from '../../actions/userAction'
import { updateProfileReset } from '../../store/slices/profileSlice'
import MetaData from '../navbar/MetaData'


const UpdateProfile = () => {


  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { user } = useSelector(
    (state) => state.user
  );

  const {error, isUpdated, isLoading} = useSelector((state)=>state.profile)

  const [name, setName ] = useState('');
  const [email, setEmail] = useState('')

  const [avatar, setAvatar] = useState('/Profile.png');
  const [avatarPreview, setAvatarPreview] = useState('/Profile.png');


  const  updateProfileSubmit = (e)=>{
    e.preventDefault();

    const myForm = new FormData();

    myForm.append('name', name);
    myForm.append('email', email);
    myForm.append('avatar', avatar);
    dispatch(updateProfile(myForm))

    
  }

  const  updateProfileDataChange = (e)=>{
     if(e.target.name === 'avatar'){

      const reader = new FileReader();

      reader.onload = ()=>{
        if(reader.readyState===2){
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
          
        }
      }
      reader.readAsDataURL(e.target.files[0])

     }

  }
  

  useEffect(()=>{

    if(user){
      setName(user.name)
      setEmail(user.email)
      setAvatarPreview(user.avatar.url)
    }

    if(error){
      toast.error(error)
      dispatch(clearError())
      
    }
    if(isUpdated){
        toast.success('Profile Updated Successfully')
        
        dispatch(loadUser())
        navigate('/account')

        dispatch(updateProfileReset())
    }

  },[dispatch, error, user, isUpdated, navigate
  ])



  return (
    <>
     <ToastContainer/>
      {isLoading ? (
        <Loader />
      ) : (
        <>
       
          <MetaData title="Update Profile" />
       
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>

              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default UpdateProfile