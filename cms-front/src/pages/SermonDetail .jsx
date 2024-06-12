// src/components/SermonDetail.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSermons } from "../store/sermonsSlice";
import { toast } from "react-toastify";

const SermonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sermons = useSelector((state) => state.sermons.items);
  const status = useSelector((state) => state.sermons.status);
  const error = useSelector((state) => state.sermons.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSermons());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "failed") {
      toast.error(`Error: ${error}`);
    }
  }, [status, error]);

  const sermon = sermons.find((sermon) => sermon._id === id);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!sermon) {
    return <div>Sermon not found</div>;
  }

  const isYouTube =
    sermon.fileLink &&
    (sermon.fileLink.includes("youtube.com") ||
      sermon.fileLink.includes("youtu.be"));
  const isAudio =
    sermon.file &&
    (sermon.file.endsWith(".mp3") || sermon.file.endsWith(".wav"));
  const isAudioLink =
    sermon.fileLink &&
    (sermon.fileLink.endsWith(".mp3") || sermon.fileLink.endsWith(".wav"));

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Back
      </button>
      <h1 className="text-3xl font-bold mb-4">{sermon.title}</h1>
      <p className="text-lg mb-4">Preacher: {sermon.preacher}</p>
      <p className="text-lg mb-4">
        Date: {new Date(sermon.date).toLocaleDateString()}
      </p>
      <p className="text-lg mb-4">{sermon.preaching}</p>
      {isYouTube ? (
        <iframe
          width="560"
          height="315"
          src={getYouTubeEmbedUrl(sermon.fileLink)}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : isAudio ? (
        <audio controls>
          <source src={sermon.file} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : isAudioLink ? (
        <audio controls>
          <source src={sermon.fileLink} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        sermon.fileLink && (
          <a
            href={sermon.fileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Listen/View
          </a>
        )
      )}
    </div>
  );
};

export default SermonDetail;
