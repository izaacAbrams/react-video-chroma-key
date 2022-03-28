import React from "react";
import styled from "styled-components";
import { StepsSidebar } from "./StepsSidebar";
import { Uploader } from "./Uploader";

const StyledContainer = styled.div`
  width: 50vw;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledChromaKeyContainer = styled.div`
  width: 50vw;
  height: 40vh;
  margin: auto;
  display: flex;
  padding: 20px;
`;

const StyledVideo = styled.video``;

export const ChromaKey = ({
  setVideo,
  video,
  updateVideoProps,
}: {
  setVideo: (file: File) => void;
  video: Blob | undefined;
  updateVideoProps: ({
    width,
    height,
    duration,
  }: {
    width: number;
    height: number;
    duration: number;
  }) => void;
}) => {
  return (
    <StyledContainer>
      {/* step 1 */}
      <StyledChromaKeyContainer>
        <Uploader setVideo={(video: File) => setVideo(video)} />
        {/* <canvas id="thumbnail-display" style={{ display: "none" }} />
      <Uploader setVideo={(video: File) => setVideo(video)} /> */}
        {/* {video && (
        <video
          controls
          width="250"
          src={URL.createObjectURL(video)}
          onLoadedMetadata={(e) => {
            const {
              videoWidth: width,
              videoHeight: height,
              duration,
            } = e.currentTarget;
            updateVideoProps({
              width,
              height,
              duration,
            });
          }}
        ></video>
      )} */}
        <StepsSidebar />
      </StyledChromaKeyContainer>
      {video && (
        <StyledVideo
          controls
          width="500"
          src={URL.createObjectURL(video)}
          onLoadedMetadata={(e) => {
            const {
              videoWidth: width,
              videoHeight: height,
              duration,
            } = e.currentTarget;
            updateVideoProps({
              width,
              height,
              duration,
            });
          }}
        ></StyledVideo>
      )}
    </StyledContainer>
  );
};
