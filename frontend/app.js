const videoBtn = document.querySelector(".get-video-btn");
const videoSection = document.querySelector(".videos");
const closeBtn = document.querySelector(".close");
const error404Wrapper = document.querySelector(".error-404-container");
const moreBtn = document.querySelector(".more");
const youtubeLinkRegex = /^(https:\/\/)?(www\.)?youtube\.com\/(watch\?v=\w|playlist\?list=\w|channel\/\w)/;
let idList = [];
let currentNextPageToken = null;
const invalidLinks = [];

videoBtn.addEventListener("click", handleVideoBtn);
moreBtn.addEventListener("click", fetchVideos);
closeBtn.addEventListener("click", handleCloseBtn);

function handleVideoBtn() {
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
      } else if (inputLink.includes("channel")) {
        idList.push(["c", inputLink]);
      }
      console.log(`YES: ${inputLink}`);
    } else {
      console.log(`WRONG: ${inputLink}`);
      invalidLinks.push(inputLink);
    }
  });
  inputField.value = "";
  invalidLinks.length >= 1 && showInvalidLinks(invalidLinks);
  fetchVideos();
}

function fetchVideos() {
  if (idList.length < 1) return;
  const categoryLink = idList[0];
  if (categoryLink[0] === "p") {
    playlistLinkIframes(categoryLink[1], currentNextPageToken);
  } else {
    channelLinkIframes(categoryLink[1], currentNextPageToken);
  }
}

function handleCloseBtn() {
  error404Wrapper.classList.remove("open");
}

function showInvalidLinks(inavlidLinks) {
  const errorEl = document.querySelector(".error-404-container");
  const invalidLinksUl = document.querySelector(".invalid-link");
  inavlidLinks.forEach((inavlidLink) => {
    invalidLinksUl.innerHTML += `<li>${inavlidLink}</li>`;
  });
  errorEl.classList.add("open");
}

// Fetching and Creating Iframes
async function getChannelOrPlaylistVideos(
  category,
  id,
  nextPageToken,
  directLink
) {
  const response = await fetch(
    `http://localhost:5000/${category}?id=${id}&nextPageToken=${nextPageToken}`
  );
  const data = await response.json();
  try {
    const videoIds = data.video_ids;
    currentNextPageToken = data.nextPageToken;
    videoIds.forEach((videoId) => {
      const iframeHtml = `<div class="videoWrapper">
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
    }
  }
  console.log(currentNextPageToken);
  if (currentNextPageToken) {
    moreBtn.style.display = "block";
  } else {
    if (idList.length > 1) {
      moreBtn.style.display = "block";
      currentNextPageToken = null;
      idList.shift();
      console.log(idList);
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
