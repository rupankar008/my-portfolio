import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await getNowPlaying();

    // Debug logging for the developer (you can see this in Vercel Logs)
    console.log("Spotify API Status:", response.status);

    if (response.status === 204) {
      return NextResponse.json({ isPlaying: false, status: "No song playing" });
    }

    if (response.status > 400) {
      const errorText = await response.text();
      console.error("Spotify API Error Response:", errorText);
      return NextResponse.json({ isPlaying: false, error: "Spotify API rejection", status: response.status });
    }

    const song = await response.json();

    if (!song || song.item === null) {
      return NextResponse.json({ isPlaying: false, status: "Song item null" });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist: any) => _artist.name).join(", ");
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    return NextResponse.json({
      album,
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title,
    });
  } catch (error: any) {
    console.error("Internal Server Error:", error.message);
    return NextResponse.json({ isPlaying: false, error: error.message });
  }
}
