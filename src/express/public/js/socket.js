'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const COUNT_COMMENTS_ELEMENT = 4;

  const socket = io(SERVER_URL);

  const createCommentElement = (comment, isLast) => {
    const commentTemplate = document.querySelector(`#comment-template`);
    const commentElement = commentTemplate.cloneNode(true).content;

    if (isLast) {
      commentElement.querySelector(`.last__list-item`).classList.add(`last__list-item--end`);
    }

    commentElement.querySelector(`.last__list-item`).id = `comment-${comment.id}`;
    commentElement.querySelector(`.last__list-image`).src = `/img/${comment.user.avatar || 'icons/smile.svg'}`;
    commentElement.querySelector(`.last__list-name`).textContent = comment.user.name;
    commentElement.querySelector(`.last__list-link`).href = `/articles/${comment.postId}`;
    commentElement.querySelector(`.last__list-link`).textContent = comment.text;

    return commentElement;
  };

  const updateCommentsElementsAfterCreation = (comment) => {
    const lastCommentsBlock = document.querySelector(`.main-page__last`);
    const lastCommentsList = lastCommentsBlock.querySelector(`.last__list`);

    if (lastCommentsList) {
      const commentElements = lastCommentsList.querySelectorAll(`li`);

      if (commentElements.length === COUNT_COMMENTS_ELEMENT) {
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

      const emptyWarningElement = document.createElement('p');
      emptyWarningElement.classList.add(`last__empty`);
      emptyWarningElement.textContent = `Здесь пока ничего нет`;

      lastCommentsBlock.append(emptyWarningElement);
    } else {
      lastCommentsList.innerHTML = '';

      lastComments.forEach((comment, index) => {
        lastCommentsList.append(createCommentElement(comment, index === lastComments.length - 1));
      });
    }
  };

  socket.addEventListener(`comment:create`, (comment) => {
    updateCommentsElementsAfterCreation(comment);
  });

  socket.addEventListener(`comment:delete`, (lastComments) => {
    updateCommentsElementsAfterDeletion(lastComments);
  });
})();
