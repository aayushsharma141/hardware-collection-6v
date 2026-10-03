import { getHomePage, getSiteSettings } from "./src/content/sanity/queries";

async function run() {
  const home = await getHomePage();
  console.log("HomePage keys:", Object.keys(home || {}));

  const settings = await getSiteSettings();
  console.log("Settings keys:", Object.keys(settings || {}));
}

run();
