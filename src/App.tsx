import React, { useState, useEffect } from "react";
import "./App.css";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Uploader } from "./components/Uploader";
import { ChromaKey } from "./components/ChromaKey";

const ffmpeg = createFFmpeg({
  log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
});

type VideoPropsType = {
  width: number | null;
  height: number | null;
  duration: number | null;
};

function App() {
  // const videoRef = React.useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<File>();
  const [bg, setBg] = useState<File>();
  const [thumbnail, setThumbnail] = useState<string>();
  const [finalVideo, setFinalVideo] = useState<string>();
  // const [videoProps, setVideoProps] = useState<VideoPropsType>();
  let videoProps: VideoPropsType = {
    width: null,
    height: null,
    duration: null,
  };

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const makeThumbnail = async () => {
      if (video) {
        ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));

        // ffmpeg -f lavfi -i color=c=black:s=1280x720 -i video.mp4 -shortest -filter_complex "[1:v]chromakey=0x70de77:0.1:0.2[ckout];[0:v][ckout]overlay[out]" -map "[out]" output.mkv

        // Run the FFMpeg command
        await ffmpeg.run(
          "-ss",
          "00:00:00",
          "-i",
          "test.mp4",
          "-frames:v",
          "1",
          "-q:v",
          "2",
          "thumbnail.jpg"
        );

        // await ffmpeg.run(
        //   "-i",
        //   "test.mp4",
        //   "-filter_complex",
        //   "[1:v]colorkey=0x23fb00:0.3:0.2[ckout];[0:v]overlay[out]",
        //   "-map",
        //   "[out]",
        //   "out.mov"
        // );
      }

      // Read the result
      const data = ffmpeg.FS("readFile", "thumbnail.jpg");
      // Create a URL
      const url = URL.createObjectURL(
        // new Blob([data.buffer], { type: "image/gif" })
        new Blob([data.buffer], { type: "image/jpg" })
      );
      setThumbnail(url);
      const imageBlob = new Blob([data.buffer], { type: "image/jpg" });
      const canvas = document.querySelector(
        "#thumbnail-display"
      ) as HTMLCanvasElement | null;
      if (canvas) {
        canvas.width = 192;
        canvas.height = 108;
        canvas.onmousemove = handleCanvasMouseover;
        createImageBitmap(imageBlob).then((image) => {
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
        });
        canvas.style.display = "block";
      }
    };
    makeThumbnail();
  }, [video]);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    // var blob = new Blob([response.data]);
    var downloadElement = document.createElement("a");
    // var href = window.URL.createObjectURL(blob); //create the download url
    if (finalVideo) {
      downloadElement.href = finalVideo;
      downloadElement.download = "test.webm"; //the name of the downloaded file
      document.body.appendChild(downloadElement);
      downloadElement.click(); //click to file
      document.body.removeChild(downloadElement); //remove the element
      // window.URL.revokeObjectURL(href); //relea
    }
  };

  const makeRgba = (buffer: ArrayBufferLike) => {
    const newBuffer = new Uint8Array(buffer);
    const r = newBuffer[0]; //red channel of first pixel on first row
    const g = newBuffer[1]; // green channel of first pixel on first row
    const b = newBuffer[2]; // blue channel of first pixel on first row
    const a = newBuffer[3]; // alpha channel of first pixel on first row
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const handleCanvasMouseover = (e: MouseEvent) => {
    console.log("e: ", e);
    const canvas = e.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const data = ctx.getImageData(x, y, 1, 1).data;

      console.log("data: ", makeRgba(data.buffer));
    }
  };

  const chromaKeyVideo = async () => {
    // Write the file to memory
    if (video) {
      ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));

      // ffmpeg -f lavfi -i color=c=black:s=1280x720 -i video.mp4 -shortest -filter_complex "[1:v]chromakey=0x70de77:0.1:0.2[ckout];[0:v][ckout]overlay[out]" -map "[out]" output.mkv

      // Run the FFMpeg command
      await ffmpeg.run(
        "-f",
        "lavfi",
        "-t",
        "1",
        "-i",
        "color=s=1920x1080",
        "-i",
        "test.mp4",
        "-shortest",
        "-filter_complex",
        "[1:v]chromakey=0x18e000:0.27:0.15[ckout];[0:v][ckout]overlay[out]",
        "-map",
        "[out]",
        "-pix_fmt",
        "yuva420p",
        "-metadata:s:v:0",
        "alpha_mode=1",
        "-acodec",
        "libvorbis",
        "-preset",
        "ultrafast",
        "-t",
        "3",
        "output.webm"
      );

      // await ffmpeg.run(
      //   "-i",
      //   "test.mp4",
      //   "-filter_complex",
      //   "[1:v]colorkey=0x23fb00:0.3:0.2[ckout];[0:v]overlay[out]",
      //   "-map",
      //   "[out]",
      //   "out.mov"
      // );
    }

    // Read the result
    const data = ffmpeg.FS("readFile", "output.webm");

    // Create a URL
    const url = URL.createObjectURL(
      // new Blob([data.buffer], { type: "image/gif" })
      new Blob([data.buffer], { type: "video/mp4" })
    );
    setFinalVideo(url);
  };

  return ready ? (
    <div className="App">
      <ChromaKey
        setVideo={(file) => setVideo(file)}
        video={video}
        updateVideoProps={(props: VideoPropsType) => {
          videoProps.width = props.width;
          videoProps.height = props.height;
          videoProps.duration = props.duration;
        }}
      />
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
