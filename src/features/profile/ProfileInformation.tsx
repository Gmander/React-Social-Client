import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAsync, getProfileByIdAsync, selectProfile } from "./profileSlice";
import { checkProfileOwnership } from "./profile.api";
import Image from 'react-bootstrap/Image'
import { canFollow, followUser, unfollowUser } from "../follow/followers.api";
// import { updateProfile } from "firebase/auth";

export default function ProfileInformation(props: any) {
  const [doneLoading, setDoneLoading] = useState(false);
  const profile = useSelector(selectProfile);
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const [showEditButton, setShowEditButton] = useState(false);

  //attempting follow button hide
  //added followbutton state similar to showEd
  const [showFollowButton, setShowFollowButton] = useState(false);
  

  // Initial states for our constants
  let initialFollowerNum:number = 0;
  let initalUserId:string = "";
  let buttonName = "Follow";
  let initialFollowingNum:number = 0;

  // Constants to be manipulated within .then statements
  const [followButton, setButton] = useState(buttonName);
  const [toggleButton, setToggleButton] = useState(false);

  // Fetches a fresh profile
  function updateProfile() {
    if (id === undefined)
    {
        setTimeout(() => dispatch(getProfileAsync(profile)), 100);
    }
    else setTimeout(() => dispatch(getProfileByIdAsync(id)), 100);
  }

  // Toggles the follow button and handles the follow api calls.
  function toggleFollowButton() {
    if (toggleButton){
      //profile.can_follow = false;
      setToggleButton(false);
      followUser(profile.user_id).then( async () => {
          updateProfile();
      })
      parseFollowBtn();

    } else {
      //profile.can_follow = true;
      setToggleButton(true);
      unfollowUser(profile.user_id).then(async () => {
          updateProfile();
      })

      parseFollowBtn();
    }
  }

  function parseFollowBtn() {
    if (toggleButton) {
      buttonName = "Follow";
      setButton(buttonName);
    }
    else {
      buttonName = "Unfollow"
      setButton(buttonName);
    }
  }

  useEffect(() => {
    setDoneLoading(false);
    if(id === undefined) {
      dispatch(getProfileAsync(profile));
      setShowEditButton(true);
      setShowFollowButton(false);
      setTimeout(() => setDoneLoading(true), 200);
    } else {
      dispatch(getProfileByIdAsync(id));
      checkProfileOwnership(id).then((owns) => {
        setShowEditButton(owns);
        setShowFollowButton(!owns);
        console.log(owns);
        console.log(showFollowButton);
        if (!owns) {
        setTimeout(() => setDoneLoading(true), 300);
          canFollow(profile.user_id).then((data) => {
            //profile.can_follow = data;
             setToggleButton(data);
             parseFollowBtn();
          });
        }
        
        setTimeout(() => setDoneLoading(true), 300);
      })
    }
    
  }, [props.beep]); // beep beep :^)

  const goToEditProfile = () => {
    history.push("/editProfile");
  }
  return(
    doneLoading ? (
      <div>
        <div id="ProfilePage">
          <img src={profile.profile_img} id="ProfileImg" />
          <img src={profile.header_img} id="HeaderImg" />
          <Card.Body id="profileBody">
            <Card.Title id = "ProfileName">
              {profile.first_name} {profile.last_name} 
              <div>
                <h6 id="followers-num">followers: {profile.follower_num}</h6>
                <h6 id="following-num">following: {profile.following_num}</h6>
              </div>
              {showEditButton ? <Button id="EditProfileButton" onClick={goToEditProfile}>Edit Profile</Button> : <></>}
            </Card.Title>
            
                {showFollowButton ? <Button variant="success" id="follow-btn" type="button" onClick={() =>toggleFollowButton()} > {followButton} </Button> : <></>}

            <Card.Text id="AboutMe">
              <h5>About Me</h5>
              {profile.about_me}
            </Card.Text>
            <Card.Text id="AboutMe">
              <h5>Fast Facts</h5>
              Birthday: {profile.birthday}
              <br />
              Hobbies: {profile.hobby}
              <br />
              Location: {profile.location}
            </Card.Text>
          </Card.Body>
        </div>
      </div>
    ) : (
      <Image
        id="LoadingImg"
        src = {"https://app.revature.com/assets/images/ajax-loader-logo.0cd555cc.gif"} 
        style={{height:'192px', width: '300px'}}
        fluid data-testid="gif"
      />
    )
  )
}
