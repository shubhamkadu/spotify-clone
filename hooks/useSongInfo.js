import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "../atoms/songAtom";
import useSpotify from "./useSpotify";
import { useSession } from "next-auth/react";

function useSongInfo() {
  const { data: session } = useSession();

  const spotifyApi = useSpotify();
  const [currentIdTrack, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  // console.log(`spotifyApi ${currentIdTrack}`);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentIdTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
          {
            headers: {
              Authorization: `Bearer${spotifyApi.getAccessToken()} `,
            },
          }
        ).then((res) => res.json());

        console.log(`this is songinfo${trackInfo.artists}`);

        setSongInfo(trackInfo);
      }
    };
    fetchSongInfo();
  }, [currentIdTrack, spotifyApi]);
  return songInfo;
}

export default useSongInfo;
