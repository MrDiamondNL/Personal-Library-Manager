import { useRef, useEffect, useState } from 'react'

export const ImageCapture = () => {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [hasPhoto, setHasPhoto] = useState(false);

    const getVideo = () => {
        navigator.mediaDevices.getUserMedia(
            {
                video: {
                    width: 480,
                    height: 640,
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
        const width = 480;
        const height = 640;

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true);

        photo.toBlob((blob) => {
            const imageFile = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
            setCapturedImage(imageFile);
        }, "image/jpeg", 0.7);
    }

    const savePhoto = () => {
        if (!hasPhoto) return;

        const link = document.createElement("a");
        link.download = `photo-${new Date().getTime()}.jpg`;
        const url = URL.createObjectURL(capturedImage);
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
    }

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
                        <button onClick={savePhoto}>Save</button>
                        <button onClick={clearPhoto}>Clear</button>
                    </>
                }
            </div>
        </>

    )
}
