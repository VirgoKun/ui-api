const fetch = require('node-fetch'); // WAJIB import fetch biar gak undefined (kalau belum global)

class Spotify {
  static baseUrl = 'https://spotifydown.app';

  /**
   * Cari lagu dari query Spotify (judul, link, atau teks)
   * @param {string} query - Judul lagu atau link Spotify
   * @returns {Promise<{status: boolean, result: Array<{title: string, artists: string, link: string}>, raw: object}>}
   */
  static async search(query) {
    const res = await fetch(`${this.baseUrl}/api/metadata?link=${encodeURIComponent(query)}`, {
      method: 'POST'
    });
    const json = await res.json();
    const tracks = json?.data?.tracks || [];

    return {
      status: tracks.length > 0,
      result: tracks.map(track => ({
        title: track.name,
        artists: track.artists,
        link: track.link
      })),
      raw: json
    };
  }

  /**
   * Ambil detail lagu dari link track Spotify
   * @param {string} link - Link lagu Spotify (track)
   * @returns {Promise<{status: boolean, result: object, raw: object}>}
   */
  static async details(link) {
    const res = await fetch(`${this.baseUrl}/api/metadata?link=${encodeURIComponent(link)}`, {
      method: 'POST'
    });
    const json = await res.json();
    return {
      status: !!json?.data?.name,
      result: json?.data || {},
      raw: json
    };
  }

  /**
   * Unduh lagu dari link track Spotify
   * @param {string} link - Link lagu Spotify (track)
   * @returns {Promise<{status: boolean, result: {title: string, artists: string, thumbnail: string, url: string}, raw: object}>}
   */
  static async download(link) {
    const res = await fetch(`${this.baseUrl}/api/download?link=${encodeURIComponent(link)}`, {
      headers: { Referer: `${this.baseUrl}/` }
    });

    const json = await res.json();
    if (!json?.link) {
      return {
        status: false,
        result: {
          title: undefined,
          artists: undefined,
          thumbnail: undefined,
          url: undefined
        },
        raw: json
      };
    }

    return {
      status: true,
      result: {
        title: json?.meta?.title,
        artists: json?.meta?.artists,
        thumbnail: json?.meta?.thumbnail,
        url: json?.link
      },
      raw: json
    };
  }
}

// Export class-nya biar bisa di-require
module.exports = Spotify;
