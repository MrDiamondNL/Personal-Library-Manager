import { useRef, useEffect, useState } from 'react'

export const ImageCapture = ({ onImageCapture, closePopup }) => {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [hasPhoto, setHasPhoto] = useState(false);

    const getVideo = () => {

        const width = 240;
        const height = 320;

        navigator.mediaDevices.getUserMedia(
            {
                video: {
                    width: 240,
                    height: 320,
                    aspectRatio: 0.75,
                    facingMode: "environment",
                    frameRate: { ideal: 24 }
                }
            }).then(stream => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            }).catch(error => {
                console.log(error);
            })
    }

    const takePhoto = () => {

        const width = 240;
        const height = 320;

        setHasPhoto(true);

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height, 0, 0, width, height);


        photo.toBlob((blob) => {
            const imageFile = new File([blob], `photo-${new Date().getTime()}.jpg`, { type: "image/jpeg" });
            setCapturedImage(imageFile);
            onImageCapture(imageFile);
        }, "image/jpeg", 0.7);
    }

    // const savePhoto = () => {
    //     if (!hasPhoto) return;

    //     const link = document.createElement("a");
    //     link.download = `photo-${new Date().getTime()}.jpg`;
    //     const url = URL.createObjectURL(capturedImage);
    //     link.href = url;
    //     link.click();

    //     URL.revokeObjectURL(url);
    // }

    const clearPhoto = () => {
        setHasPhoto(false);
        setCapturedImage(null);

        const photo = photoRef.current;
        const ctx = photo.getContext("2d");
        ctx.clearRect(0, 0, photo.width, photo.height);

        getVideo();
    }

    useEffect(() => {
        getVideo();
    }, [videoRef]);

    return (
        <>
            {!hasPhoto &&
                <div className="camera">
                    <video ref={videoRef}></video>
                    <button onClick={takePhoto}>Capture</button>
                </div>
            }
            <div className={"result" + (hasPhoto ? "hasPhoto" : "")}>
                <canvas ref={photoRef}></canvas>
                {hasPhoto &&
                    <>
                        <button onClick={closePopup}>Use Photo</button>
                        <button onClick={clearPhoto}>Clear</button>
                    </>
                }
            </div>
        </>

    )
}
