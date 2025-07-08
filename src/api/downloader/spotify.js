const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");

async function spotifydl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const a = cheerio.load(
        (
          await axios.get("https://spotifymate.com/en", {
            headers: {
              cookie: "session_data=o8079end5j9oslm5a7bou84rqc;",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
            },
          })
        ).data
      );

      const hiddenInput = {
        name: a("form#get_video").find('input[type="hidden"]').attr("name") || "",
        value: a("form#get_video").find('input[type="hidden"]').attr("value") || "",
      };

      const form = new FormData();
      form.append("url", url);
      form.append(hiddenInput.name, hiddenInput.value);

      const res = await axios.post("https://spotifymate.com/action", form, {
        headers: {
          ...form.getHeaders(),
          origin: "https://spotifymate.com/en",
          cookie: "session_data=o8079end5j9oslm5a7bou84rqc;",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        },
      });

      if (res.statusText !== "OK") return reject("Fail Fetching");

      const $ = cheerio.load(res.data);
      const data = {
        title: $(".dlvideos").find('h3[itemprop="name"]').text().trim(),
        author: $(".dlvideos")
          .find(".spotifymate-downloader-middle > p > span")
          .text()
          .trim(),
        thumbnail: $(".dlvideos").find("img").attr("src") || "",
        cover:
          $(".dlvideos")
            .find(".spotifymate-downloader-right")
            .find("#none")
            .eq(1)
            .find("a")
            .attr("href") ||
          $(".dlvideos")
            .find(".spotifymate-downloader-right")
            .find("#pop")
            .eq(1)
            .find("a")
            .attr("href") ||
          "",
        music:
          $(".dlvideos")
            .find(".spotifymate-downloader-right")
            .find("#none")
            .eq(0)
            .find("a")
            .attr("href") ||
          $(".dlvideos")
            .find(".spotifymate-downloader-right")
            .find("#pop")
            .eq(0)
            .find("a")
            .attr("href") ||
          "",
        link: url,
      };

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = function (app) {
  app.get("/downloader/spotify", async (req, res) => {
    const { url } = req.query;
    if (!url) {
      return res
        .status(400)
        .json({ status: false, error: "Parameter 'url' is required" });
    }

    try {
      const result = await spotifydl(url);
      res.status(200).json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message || err });
    }
  });
};
