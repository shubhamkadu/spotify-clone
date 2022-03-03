import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import useSongInfo from "../hooks/useSongInfo";

import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();
  // console.log(`this is player ${songInfo}`);

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing", data.body?.item);
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // fetch the info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncesAdjustVolume(volume);
    }
  }, [volume]);

  const debouncesAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {
        console.log(err);
      });
    }, 100),
    []
  );

  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 text-white
      grid grid-cols-3 text-xs md:text-base px-2 md:px-8
      "
    >
      <div className="flex item-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div className="">
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* center  */}
      <div className="flex item-center justify-evenly">
        <SwitchHorizontalIcon className="button " />
        <RewindIcon
          onClick={() => spotifyApi.skipToPrevious()} // The APi is not working
          className="button"
        />

        {isPlaying ? (
          <PauseIcon onClick={handlePause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePause} className="button w-10 h-10" />
        )}
        <FastForwardIcon
          onClick={() => spotifyApi.skipToNext()} // The APi is not working
          className="button "
        />
        <ReplyIcon className="button" />
      </div>

      {/* Right  */}
      <div className=" flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-14 md:w-28 h-1 in-range:border-green-500 "
          type="range"
          value={volume}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
