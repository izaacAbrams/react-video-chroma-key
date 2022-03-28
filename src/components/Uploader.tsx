import React from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

type ContainerStyleType = {
  isFocused: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
};

const getColor = (props: ContainerStyleType) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const Container = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props: ContainerStyleType) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const StyledUploadContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const Uploader = ({
  setVideo,
}: {
  setVideo: (file: File) => void;
}): JSX.Element => {
  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      setVideo(file);
      // const reader = new FileReader();

      // reader.onabort = () => console.log("file reading was aborted");
      // reader.onerror = () => console.log("file reading has failed");
      // reader.onload = () => {
      //   // Do whatever you want with the file contents
      //   const binaryStr = reader.result;
      //   console.log(binaryStr);
      // };
      // reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: "image/*,video/*", onDrop });

  return (
    <StyledUploadContainer className="container">
      <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </Container>
    </StyledUploadContainer>
  );
};
