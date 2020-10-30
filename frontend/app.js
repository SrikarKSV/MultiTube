const videoBtn = document.querySelector(".get-video-btn");
const videoSection = document.querySelector(".videos");
const closeBtns = document.querySelectorAll(".close");
const error404Wrapper = document.querySelector(".error-404-container");
const error403Wrapper = document.querySelector(".error-403-container");
const moreBtn = document.querySelector(".more");
const youtubeLinkRegex = /^(https:\/\/)?(www\.)?(m\.)?youtube\.com\/(watch\?v=\w|playlist\?list=\w|channel\/\w|user\/\w)/;
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

  inputLinks = inputValue.split(",");
  inputLinks.forEach((inputLink) => {
    inputLink = inputLink.trim();
    let validBool = youtubeLinkRegex.test(inputLink);
    if (validBool) {
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
  invalidLinks.length >= 1 && showInvalidLinks(invalidLinks);
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
  const response = await fetch(
    `https://srikar18.pythonanywhere.com/${category}?id=${id}&nextPageToken=${nextPageToken}`
  );
  const data = await response.json();
  try {
    const videoIds = data.video_ids;
    currentNextPageToken = data.nextPageToken;
    videoIds.forEach((videoId) => {
      const iframeHtml = `<div class="videoWrapper">
                      <button aria-label="Remove Video" class="remove" title="Remove video"></button>
                      <button aria-label="Scale Video" class="scale" title="Scale video"></button>
                      <p>Loading...</p>
                      <iframe width="560" height="315"
                      src="https://www.youtube.com/embed/${videoId}"
                      frameborder="0" allow="accelerometer; autoplay; clipboard-write;
                      encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                      </div>`;
      const iframHtmlFragment = document
        .createRange()
        .createContextualFragment(iframeHtml);
      videoSection.appendChild(iframHtmlFragment);
    });
  } catch {
    const errorCode = data.error;
    if (Number(errorCode) === 404) {
      showInvalidLinks([directLink]);
      idList.unshift();
    } else {
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
  const iframeHtml = `<div class="videoWrapper">
                        <button aria-label="Remove Video" class="remove" title="Remove video"></button>
                        <button aria-label="Scale Video" class="scale" title="Scale video"></button>
                        <p>Loading...</p>
                        <iframe width="560" height="315"
                        src="https://www.youtube.com/embed/${videoId}"
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write;
                        encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>`;
  const iframHtmlFragment = document
    .createRange()
    .createContextualFragment(iframeHtml);
  videoSection.appendChild(iframHtmlFragment);
}

// Handle Errors
function handleErrorCloseBtn() {
  error403Wrapper.classList.remove("open");
  error404Wrapper.classList.remove("open");
}

function showInvalidLinks(iLinks) {
  const errorEl = document.querySelector(".error-404-container");
  const invalidLinksUl = document.querySelector(".invalid-link");
  iLinks.forEach((inavlidLink) => {
    invalidLinksUl.innerHTML += `<li>${inavlidLink}</li>`;
  });
  invalidLinks = [];
  errorEl.classList.add("open");
}

window.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
    handleErrorCloseBtn();
  }
});
