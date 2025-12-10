import styles from "./ListComments.module.css";

import React, { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";

const ListComments = ({ listId }) => {
  const { documents: comments, error: commentsError } = useCollection(
    `lists/${listId}/comments`
  );

  const { addDocument: addComment, response } = useFirestore(
    `lists/${listId}/comments`
  );

  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState(null);

  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    setSubmitError(null);
    e.preventDefault();
    if (comment.trim().length < 1) {
      setSubmitError("Can't send empty message.");
      return;
    }
    await addComment({ content: comment, userId: user.uid });
    setSubmitError(response.error);
    setComment("");
  };

  console.log(listId);
  console.log(comments);
  if (!comments) {
    return (
      <div>
        <p>Loading Commments..</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Comments</h3>

      {comments?.map((comment) => (
        <div
          key={
            comment.id
          } /* we should never gerate key inside jsx on render time but use document item ids instead */
          className={
            user.uid === comment.userId
              ? styles["comment-div-sent"]
              : styles["comment-div-received"]
          }>
          {user.uid !== comment.userId && (
            <p>
              <strong>{comment.updatedBy}</strong>
            </p>
          )}
          <p>{comment.content}</p>
          <p className={styles["comment-date"]}>
            {comment.updatedAt
              ? formatDistanceToNow(comment.updatedAt.toDate(), {
                  addSuffix: true,
                })
              : "just now"}
          </p>
        </div>
      ))}
      {comments.length === 0 && <p>No comments yet.</p>}
      {/* creating new comments */}
      <form className={styles["comment-form"]} onSubmit={handleSubmit}>
        <label>
          <span>Add new comment:</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}></textarea>
        </label>
        <button>Send comment</button>
      </form>
      {submitError && <p className="error">{submitError}</p>}
    </div>
  );
};

export default ListComments;
