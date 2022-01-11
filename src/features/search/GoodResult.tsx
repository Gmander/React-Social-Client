import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { reverbClientWithAuth } from "../../remote/reverb-api/reverbClient";
import { Profile } from '../profile/profile';

export default function GoodResult({ user, handleClick }: any) {
  
  const [ profile, setProfile ] = useState<Profile>();

  useEffect(() => { 
    const getProfileId = async () => {
      // console.log(profile)
      if (profile === undefined) {
        const resp = await reverbClientWithAuth.get(`/api/profile/getByAuthor/${user.id}`);
        setProfile(resp.data);
      }
    };
    getProfileId();
  }, []);

  const handleFollow = () => {
    followUser();
  }

  const followUser = async () => {
    const resp = await reverbClientWithAuth.put(`/api/user/follow-user/${user?.id}`);
  }

  return (
    <div key={user.id}>
      <NavLink 
        to={`/profile/${profile?.id}`}
        id={profile?.id}
        className='search-result'
        key={profile?.id}
        onClick={() => handleClick(`/profile/${profile?.id}`)}
      >
        <img className='profile-pic-mini' src={profile?.profile_img}/>
        {profile?.first_name}&nbsp;&nbsp;
        {user.email}
      </NavLink>
      <button type='button' className="follow-btn" onClick={handleFollow}>
        FOLLOW
      </button>
      <br key={profile?.id + "1"}/>
    </div>
  );
}
