const videoBtn = document.querySelector(".get-video-btn");
const videoSection = document.querySelector(".videos");
const closeBtns = document.querySelectorAll(".close");
const error404Wrapper = document.querySelector(".error-404-container");
const error403Wrapper = document.querySelector(".error-403-container");
const infoWrapper = document.querySelector(".info");
const showInfoBtn = document.querySelector(".show-info");
const moreBtn = document.querySelector(".more");
const loaders = document.querySelectorAll(".loader");
const invalidLinksContainer = document.querySelector(".invalid-links");
const duplicateLinksContainer = document.querySelector(".duplicate-links");
const youtubeLinkRegex = /^(https:\/\/)?(www\.)?(m\.)?youtube\.com\/(watch\?v=\w|playlist\?list=\w|channel\/\w|user\/\w)/;
const allVideoLinks = [];
let duplicateLinks = [];
let idList = [];
let currentNextPageToken = null;
let invalidLinks = [];

videoBtn.addEventListener("click", handleVideoBtn);
moreBtn.addEventListener("click", fetchVideos);
closeBtns.forEach((closeBtn) => {
  closeBtn.addEventListener("click", handleErrorCloseBtn);
});
videoSection.addEventListener("click", handleVideoControls);

function handleVideoBtn(e) {
  e.preventDefault();
  const inputField = document.querySelector(".link-field");
  const inputValue = inputField.value;
  if (!inputValue.length) return;
  currentNextPageToken = null;
  idList = [];

  const inputLinks = inputValue.split(",");
  inputLinks.forEach((inputLink) => {
    inputLink = inputLink.trim();
    // Skipping if empty string provided
    if (!inputLink.length) return;
    let validBool = youtubeLinkRegex.test(inputLink);
    if (validBool) {
      // Checking if the link is already entered
      if (allVideoLinks.includes(inputLink)) {
        duplicateLinks.includes(inputLink)
          ? null
          : duplicateLinks.push(inputLink);
        return;
      } else {
        allVideoLinks.push(inputLink);
      }

      // Distributing the links into their categories
      if (inputLink.includes("watch")) {
        videoLinkIframes(inputLink);
      } else if (inputLink.includes("playlist")) {
        idList.push(["p", inputLink]);
      } else if (inputLink.includes("channel") || inputLink.includes("user")) {
        idList.push(["c", inputLink]);
      }
    } else {
      invalidLinks.push(inputLink);
    }
  });
  inputField.value = "";
  invalidLinks.length || duplicateLinks.length
    ? showInvalidLinks(invalidLinks)
    : null;
  fetchVideos();
}

// Handle video controls
function handleVideoControls(e) {
  const videoWrapper = e.target.closest(".videoWrapper");
  if (e.target.classList.contains("remove")) {
    videoWrapper.classList.add("remove-video");
    videoWrapper.addEventListener(
      "transitionend",
      () => {
        videoWrapper.remove();
      },
      { once: true }
    );
  } else {
    const videoWrapperClone = videoWrapper.cloneNode(true);
    const scaleBtn = videoWrapperClone.querySelector(".scale");
    const removeBtn = videoWrapperClone.querySelector(".remove");
    removeBtn.addEventListener("click", handleVideoControls);
    scaleBtn.remove();
    videoWrapperClone.classList.add("scale-video");
    const videoSection = videoWrapper.closest(".videos");
    videoSection.insertAdjacentElement("beforebegin", videoWrapperClone);
  }
}

// Fetching and Creating Iframes
function fetchVideos() {
  if (idList.length < 1) return;
  const categoryLink = idList[0];
  if (categoryLink[0] === "p") {
    playlistLinkIframes(categoryLink[1], currentNextPageToken);
  } else {
    channelLinkIframes(categoryLink[1], currentNextPageToken);
  }
}

async function getChannelOrPlaylistVideos(
  category,
  id,
  nextPageToken,
  directLink
) {
  // turn loader on
  loaders.forEach((loader) => {
    loader.classList.remove("hidden");
  });
  const response = await fetch(
    `https://srikar18.pythonanywhere.com/${category}?id=${id}&nextPageToken=${nextPageToken}`
  );
  const data = await response.json();
  try {
    const videoIds = data.video_ids;
    currentNextPageToken = data.nextPageToken;
    videoIds.forEach((videoId) => {
      const iframeHtml = embedVideoId(videoId);
      const iframHtmlFragment = document
        .createRange()
        .createContextualFragment(iframeHtml);
      videoSection.appendChild(iframHtmlFragment);
    });
  } catch {
    const errorCode = data.error;
    // If it is a wrong link
    if (Number(errorCode) === 404) {
      showInvalidLinks([directLink]);
      // Invalid links is removed from all videos list
      const invalidLinkIndex = allVideoLinks.findIndex(
        (allVideoLink) => allVideoLink === directLink
      );
      allVideoLinks.splice(invalidLinkIndex, 1);
      idList.unshift();
    } else {
      // Else it is a server error
      error403Wrapper.classList.add("open");
    }
  }
  if (currentNextPageToken) {
    moreBtn.style.display = "block";
  } else {
    if (idList.length > 1) {
      moreBtn.style.display = "block";
      currentNextPageToken = null;
      idList.shift();
    } else {
      moreBtn.style.display = "none";
    }
  }
  // turn the loader off
  loaders.forEach((loader) => {
    loader.classList.add("hidden");
  });
}

function channelLinkIframes(channelLink, nextPageToken) {
  const channelId = channelLink.split("/").slice(-1);
  getChannelOrPlaylistVideos("channel", channelId, nextPageToken, channelLink);
}

function playlistLinkIframes(playlistLink, nextPageToken) {
  const playlistId = playlistLink.split("=")[1];
  getChannelOrPlaylistVideos(
    "playlist",
    playlistId,
    nextPageToken,
    playlistLink
  );
}

function videoLinkIframes(videoLink) {
  const videoId = videoLink.split("=")[1].split("&")[0];
  const iframeHtml = embedVideoId(videoId);
  const iframHtmlFragment = document
    .createRange()
    .createContextualFragment(iframeHtml);
  videoSection.appendChild(iframHtmlFragment);
}

function embedVideoId(videoId) {
  return `<div class="videoWrapper">
  <button aria-label="Remove Video" class="remove" title="Remove video"></button>
  <button aria-label="Scale Video" class="scale" title="Scale video"></button>
  <p>Loading...</p>
  <iframe width="560" height="315"
  src="https://www.youtube.com/embed/${videoId}"
  frameborder="0" allow="accelerometer; autoplay; clipboard-write;
  encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>`;
}

// Handle Errors
function handleErrorCloseBtn() {
  error403Wrapper.classList.remove("open");
  error404Wrapper.classList.remove("open");
  infoWrapper.classList.remove("open");
  setTimeout(removeInvalidLinks, 500);
}

function removeInvalidLinks() {
  invalidLinksContainer.classList.add("hidden");
  duplicateLinksContainer.classList.add("hidden");
}

// This function called at 2 scenarios, one is if there is an invalid link
// at input or playlist link was wrong and second is when duplicate links are entered
function showInvalidLinks(iLinks) {
  const errorEl = document.querySelector(".error-404-container");
  if (iLinks.length >= 1) {
    invalidLinksContainer.classList.remove("hidden");
    const invalidLinksUl = document.querySelector(".invalid-link");
    // Clearing old links
    if (!errorEl.classList.contains("open")) {
      invalidLinksUl.innerHTML = "";
    }
    iLinks.forEach((inavlidLink) => {
      invalidLinksUl.innerHTML += `<li>${inavlidLink}</li>`;
    });
    invalidLinks = [];
  }
  if (duplicateLinks.length >= 1) {
    duplicateLinksContainer.classList.remove("hidden");
    const duplicateLinksUl = document.querySelector(".duplicate-link");
    // Clearing old links
    duplicateLinksUl.innerHTML = "";
    duplicateLinks.forEach((duplicateLink) => {
      duplicateLinksUl.innerHTML += `<li>${duplicateLink}</li>`;
    });
    duplicateLinks = [];
  }
  errorEl.classList.add("open");
}

showInfoBtn.addEventListener("click", () => {
  infoWrapper.classList.toggle("open");
});

// Error alert window will be closed
window.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
    handleErrorCloseBtn();
  }
});

import "regenerator-runtime/runtime";
