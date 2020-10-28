const videoBtn = document.querySelector(".get-video-btn");
const videoSection = document.querySelector(".videos");
const youtubeLinkRegex = /^(https:\/\/)?(www\.)?youtube\.com\/(watch\?v=\w|playlist\?list=\w|channel\/\w)/;

videoBtn.addEventListener("click", handleVideoBtn);

function handleVideoBtn() {
  const inputValue = document.querySelector(".link-field").value;
  if (!inputValue.length) return;

  videoLinks = inputValue.split(",");
  videoLinks.forEach((videoLink) => {
    videoLink = videoLink.trim();
    let validBool = youtubeLinkRegex.test(videoLink);
    if (validBool) {
      console.log(`YES: ${videoLink}`);
    } else {
      console.log(`WRONG: ${videoLink}`);
    }
  });

  // const playlist_id = inputValue.split("=")[1];

  // async function get_playlist_video(playlist_id) {
  //   const response = await fetch(
  //     `http://localhost:5000/playlist?id=${playlist_id}`
  //   );
  //   const data = await response.json();
  //   const videoIds = data.video_ids;
  //   const nextPageToken = data.nextPageToken;
  //   console.log(videoIds, nextPageToken);
  //   videoIds.forEach((videoId) => {
  //     const iframeHtml = `<div class="videoWrapper">
  //                       <iframe width="560" height="315"
  //                       src="https://www.youtube.com/embed/${videoId}"
  //                       frameborder="0" allow="accelerometer; autoplay; clipboard-write;
  //                       encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  //                       </div>`;
  //     const iframHtmlFragment = document
  //       .createRange()
  //       .createContextualFragment(iframeHtml);
  //     videoSection.appendChild(iframHtmlFragment);
  //   });
  // }
  // get_playlist_video(playlist_id);
}

// videoLinks = inputValue.value.split(",");
// videoLinks.forEach((videoLink) => {
//   videoLink = videoLink.trim();
//   const videoId = videoLink.split("=")[1].split("&")[0];
//   const iframeHtml = `<div class="videoWrapper">
//                       <iframe width="560" height="315"
//                       src="https://www.youtube.com/embed/${videoId}"
//                       frameborder="0" allow="accelerometer; autoplay; clipboard-write;
//                       encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
//                       </div>`;
//   const iframHtmlFragment = document
//     .createRange()
//     .createContextualFragment(iframeHtml);
//   videoSection.appendChild(iframHtmlFragment);
// });
