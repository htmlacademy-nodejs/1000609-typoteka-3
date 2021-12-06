'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const COUNT_EXTRA_ELEMENT = 4;

  const socket = io(SERVER_URL);

  const createPostElement = (post, isLast) => {
    const postTemplate = document.querySelector(`#post-template`);
    const postElement = postTemplate.cloneNode(true).content;
    const postLinkElement = postElement.querySelector(`.hot__list-link`);
    const postCommentsElement = postElement.querySelector(`.hot__link-sup`);

    if (isLast) {
      postElement.querySelector(`.hot__list-item`).classList.add(`hot__list-item--end`);
    }

    postLinkElement.href = `/articles/${post.id}`;
    postLinkElement.innerHTML = `${post.announcement}&nbsp;`;
    postCommentsElement.textContent = post.commentsCount;
    postLinkElement.append(postCommentsElement);

    return postElement;
  };

  const createCommentElement = (comment, isLast) => {
    const commentTemplate = document.querySelector(`#comment-template`);
    const commentElement = commentTemplate.cloneNode(true).content;

    if (isLast) {
      commentElement.querySelector(`.last__list-item`).classList.add(`last__list-item--end`);
    }

    commentElement.querySelector(`.last__list-image`).src = `/img/${comment.user.avatar || 'icons/smile.svg'}`;
    commentElement.querySelector(`.last__list-name`).textContent = comment.user.name;
    commentElement.querySelector(`.last__list-link`).href = `/articles/${comment.postId}`;
    commentElement.querySelector(`.last__list-link`).textContent = comment.text;

    return commentElement;
  };

  const updatePostsElements = (popularPosts) => {
    const popularPostsBlock = document.querySelector(`.main-page__hot`);
    const popularPostsList = popularPostsBlock.querySelector(`.hot__list`);

    if (!popularPosts.length) {
      popularPostsList.remove();

      const emptyWarningElement = document.createElement(`p`);
      emptyWarningElement.classList.add(`hot__empty`);
      emptyWarningElement.textContent = `Здесь пока ничего нет`;

      popularPostsBlock.append(emptyWarningElement);
    } else {
      popularPostsList.innerHTML = ``;

      popularPosts.forEach((post, index) => {
        popularPostsList.append(createPostElement(post, index === popularPosts.length - 1));
      });
    }
  };

  const updateCommentsElementsAfterCreation = (comment) => {
    const lastCommentsBlock = document.querySelector(`.main-page__last`);
    const lastCommentsList = lastCommentsBlock.querySelector(`.last__list`);

    if (lastCommentsList) {
      const commentElements = lastCommentsList.querySelectorAll(`li`);

      if (commentElements.length === COUNT_EXTRA_ELEMENT) {
        const [, , penultimateCommentElement, lastCommentElement] = commentElements;
        lastCommentElement.remove();
        penultimateCommentElement.classList.add(`last__list-item--end`);
      }

      lastCommentsList.prepend(createCommentElement(comment));
    } else {
      const emptyWarningElement = lastCommentsBlock.querySelector(`.last__empty`);
      emptyWarningElement.remove();

      const lastCommentsList = document.createElement(`ul`);
      lastCommentsList.classList.add(`last__list`);

      lastCommentsBlock.append(lastCommentsList);
      lastCommentsList.append(createCommentElement(comment, true));
    }
  };

  const updateCommentsElementsAfterDeletion = (lastComments) => {
    const lastCommentsBlock = document.querySelector(`.main-page__last`);
    const lastCommentsList = lastCommentsBlock.querySelector(`.last__list`);

    if (!lastComments.length) {
      lastCommentsList.remove();

      const emptyWarningElement = document.createElement(`p`);
      emptyWarningElement.classList.add(`last__empty`);
      emptyWarningElement.textContent = `Здесь пока ничего нет`;

      lastCommentsBlock.append(emptyWarningElement);
    } else {
      lastCommentsList.innerHTML = ``;

      lastComments.forEach((comment, index) => {
        lastCommentsList.append(createCommentElement(comment, index === lastComments.length - 1));
      });
    }
  };

  socket.addEventListener(`comment:create`, (comment, popularPosts) => {
    updateCommentsElementsAfterCreation(comment);
    updatePostsElements(popularPosts)
  });

  socket.addEventListener(`comment:delete`, (lastComments, popularPosts) => {
    updateCommentsElementsAfterDeletion(lastComments);
    updatePostsElements(popularPosts)
  });
})();
