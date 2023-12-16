const { axios } = require("../../utils/axios/axios");
const { ErrorWithStatus } = require("../../utils/error");
const { backlink } = require("./constants/backlink");
const { keywords } = require("./constants/keywords");
const { keywordsByWebsite } = require("./constants/keywordsByWebsite");
const { people_ask_for_result } = require("./constants/people_ask_for");
class SEOTools {
  /**
   *
   * @param {object} req
   * @param {string} req.target
   */
  async DAPACheck(req) {
    return {
      target: req.target,
      da_score: 100,
      pa_score: 100,
      spam_score: 14,
      total_backlinks: 1517349141,
    };
  }

  /**
   *
   * @param {object} req
   * @param {string} req.target
   */
  async RapidDAPACheck(req) {
    try {
      const response = await axios.get(
        "https://domain-da-pa-check.p.rapidapi.com",
        {
          params: { target: req.target },
          headers: {
            ...axios.defaults.headers,
            "X-RapidAPI-Host": "domain-da-pa-check.p.rapidapi.com",
          },
        }
      );
      if (response.data.result == "success") return response.data.body;
      else throw new ErrorWithStatus("DA/PA Request failed", response.status);
    } catch (err) {
      console.log(err);
      throw new ErrorWithStatus(
        "Something went wrong. Possibly couldn't communicate to DA/PA check service",
        500
      );
    }
  }

  /**
   * @param {string} domain
   */
  async getBacklinks(domain) {
    return backlink;
  }

  /**
   * @param {object} params
   * @param {string|undefined} params.country
   * @param {string} params.keyword
   */
  async getKeywords(keyword, country) {
    return keywords;
  }

  /**
   * @param {object} params
   * @param {string|undefined} params.country
   * @param {string} params.keyword
   */
  async RapidGetKeywords(params) {
    const url = !params.country
      ? "https://seo-keyword-research.p.rapidapi.com/global.php"
      : "https://seo-keyword-research.p.rapidapi.com/keynew.php";

    try {
      const response = await axios.get(url, {
        params: params,
        headers: {
          ...axios.defaults.headers,
          "X-RapidAPI-Host": "seo-keyword-research.p.rapidapi.com",
        },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      throw new ErrorWithStatus(
        "Something went wrong. Possibly couldn't communicate to Keyword service",
        500
      );
    }
  }

  /**
   *
   * @param {object} req
   * @param {string} req.domain
   * @returns {backlink}
   */
  async RapidGetBacklinks(req) {
    try {
      const response = await axios.get(
        "https://best-backlink-checker-api.p.rapidapi.com/backlinks.php",
        {
          params: { domain: req.domain },
          headers: {
            ...axios.defaults.headers,
            "X-RapidAPI-Host": "best-backlink-checker-api.p.rapidapi.com",
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw new ErrorWithStatus(
        "Something went wrong. Possibly couldn't communicate to Backlinks service",
        500
      );
    }
  }

  /**
   *
   * @param {string} url
   */
  async KeywordResearchByWebsite(url) {
    try {
      const response = await axios.get(
        "https://keyword-research-by-website.p.rapidapi.com/GetKeywordsByUrl",
        {
          params: { url, language: "en", country: "us" },
          headers: {
            ...axios.defaults.headers,
            "X-RapidAPI-Host": "keyword-research-by-website.p.rapidapi.com",
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw new ErrorWithStatus(
        "Something went wrong. Possibly couldn't communicate to Keyword service",
        500
      );
    }
  }

  /**
   * @param {string} url
   */
  async KeywordResearchByWebsite(url) {
    return keywordsByWebsite;
  }

  /**
   *
   * @param {string} url
   */
  async RapidKeywordResearchByWebsite(url) {
    try {
      const response = await axios.get(
        "https://keyword-research-by-website.p.rapidapi.com/GetKeywordsByUrl",
        {
          params: { url, language: "en", country: "us" },
          headers: {
            ...axios.defaults.headers,
            "X-RapidAPI-Host": "keyword-research-by-website.p.rapidapi.com",
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw new ErrorWithStatus(
        "Something went wrong. Possibly couldn't communicate to Keyword service",
        500
      );
    }
  }

  /**
   *
   * @param {string} keyword
   */
  async peopleAskFor(keyword) {
    return people_ask_for_result;
  }

  /**
   *
   * @param {string} keyword
   */
  async RapidPeopleAskFor(keyword) {
    try {
      const response = await axios.get(
        "https://what-people-are-searching-for.p.rapidapi.com/GetQuestionsExplorerBasic",
        {
          params: { keyword, language: "en", country: "us" },
          headers: {
            ...axios.defaults.headers,
            "X-RapidAPI-Host": "what-people-are-searching-for.p.rapidapi.com",
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw new ErrorWithStatus(
        "Something went wrong. Possibly couldn't communicate to service",
        500
      );
    }
  }
}

module.exports = { SEOTools };
