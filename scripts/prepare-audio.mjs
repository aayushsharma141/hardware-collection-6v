import fs from "fs";
import { execSync } from "child_process";

async function main() {
  const url = "https://upload.wikimedia.org/wikipedia/commons/5/53/Placid_Ambient_by_MusicLFiles.ogg";
  console.log("Downloading ambient track from Wikimedia Commons...");
  const res = await fetch(url, {
    headers: {
      "User-Agent": "HardwareCollectionWeb/1.0 (info@hardwarecollection.co)",
    },
  });
  if (!res.ok) throw new Error("Fetch failed: " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync("public/audio/temp_ambient.ogg", buf);
  console.log("Downloaded:", buf.length, "bytes");

  console.log("Encoding with ffmpeg into looping MP3...");
  execSync(
    'ffmpeg -y -i public/audio/temp_ambient.ogg -t 75 -af "afade=t=in:ss=0:d=3,afade=t=out:st=72:d=3" -b:a 128k public/audio/showroom-ambient.mp3',
    { stdio: "inherit" }
  );

  if (fs.existsSync("public/audio/temp_ambient.ogg")) {
    fs.unlinkSync("public/audio/temp_ambient.ogg");
  }

  const stat = fs.statSync("public/audio/showroom-ambient.mp3");
  console.log("Success! Created public/audio/showroom-ambient.mp3 (" + Math.round(stat.size / 1024) + " KB)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
