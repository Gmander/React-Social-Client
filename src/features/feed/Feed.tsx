import React, { useEffect, useState } from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import SubmitPost from '../post/SubmitPost'
import { getGroupPostsAsync, getPostsAsync, postGroupPostAsync, postPostAsync, selectPosts } from '../post/postSlice'
import PostComponent from '../post/PostComponent'
import SubmitComment from '../comment/SubmitComment';
import { createComment } from '../comment/comment.api';
import { initialPost } from '../post/post';
import { initialComment } from '../comment/comment';
import RefreshIcon from '../../assets/images/refreshicon.svg'
import { selectGroup } from '../group/groupSlice';
import { Post } from "../post/post"

export let util = {
  updateAll: (isGroup: boolean) => { },
  leavePost: () => { },
  leaveComment: (npostId: number) => { },
  dispatchComment: () => { },
  dispatchPost: (isGroup: boolean) => { }
};

    //isGroup: boolean;

function Feed(props: {isGroup: boolean}) {
  const dispatch = useDispatch();

  const posts = useSelector(selectPosts);

  const [modalShowPost, setModalShowPost] = useState(false);
  const [modalShowComment, setModalShowComment] = useState(false);

  const [postId, setPostId] = useState(0);

  const [shouldUpdateLikes, setShouldUpdateLikes] = useState([false]);

  const group = useSelector(selectGroup);

  util.updateAll = (isGroup: boolean) => {
    isGroup ? 
    dispatch(getGroupPostsAsync(group.name))
    :
    dispatch(getPostsAsync({}));
    setShouldUpdateLikes([!shouldUpdateLikes[0]]); // :^) 
    
    // console.log("Updated feed");
  }

  const [comment, setComment] = useState(initialComment);
  const [post, setPost] = useState(initialPost);

  util.leavePost = () => {
    setPost(initialPost);
    setModalShowPost(true);
  }

  util.leaveComment = (npostId: number) => {
    setComment(initialComment);
    setPostId(npostId);
    setModalShowComment(true);
  }

  util.dispatchComment = () => {
    createComment(postId, comment).then(() => util.updateAll(props.isGroup));
  }

  util.dispatchPost = (isGroup) => {
    isGroup ? dispatch(postGroupPostAsync(post)) : dispatch(postPostAsync(post));
  }

  useEffect(() => {
    console.log("Loading Feed")
    util.updateAll(props.isGroup);
    
    setTimeout(() => {
      let newPost: Post = post;
      console.log("Assigning groupID");
      newPost.groupID = group.groupID;

      console.log(group);

      setPost(newPost);
      console.log("Done loading feed")
    }, 200)
    
  }, [])

  return (
    (
    <Container id="feedBody">
      <Row>
        <Col id="postColumn" xs={{span: 8, offset: 2}}>
          <div id="feedButtons"> 
            <Button data-testid="postButton" id="postBtn" variant="primary" onClick={() => util.leavePost()}>
              + Create Post
            </Button>
            <Button data-testid="refreshButton" id="refreshBtn" variant="primary" onClick={() => util.updateAll(props.isGroup)}>
              <img src={RefreshIcon} /> Refresh
            </Button>
          </div>
          <SubmitPost
            setPost={setPost}
            post={post}
            dispatchPost={util.dispatchPost}
            show={modalShowPost}
            onHide={() => setModalShowPost(false)}
          />
          <SubmitComment
            setComment={setComment}
            comment={comment}
            show={modalShowComment}
            dispatchComment={util.dispatchComment}
            onHide={() => setModalShowComment(false)}
            postId={postId}
          />
          {posts.map((post) => (<PostComponent shouldUpdateLikes={shouldUpdateLikes}
            post={post} leaveComment={util.leaveComment} key={post.id} />)).reverse()}
        </Col>
      </Row>
    </Container>)
  );
}

export default Feed