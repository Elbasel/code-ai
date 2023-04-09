import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";

type ServerResponse = {
  relativePathNames?: string[];
  allRelativeHrefs?: string[];
  allHrefs?: string[];
  samePathName?: string[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerResponse>
) {
  const allHrefs = new Set<string>();
  const allRelativeHrefs = new Set<string>();
  const relativePathNames = new Set<string>();
  const samePathName = new Set<string>();

  try {
    const requestUrl = req.query?.url as string;

    if (!requestUrl) {
      res.status(400).json({ error: "No URL provided" });
    }

    // TODO make this into a util function
    const parsedRequestUrl = requestUrl.startsWith("https")
      ? requestUrl
      : `https://${requestUrl}`;

    const parsedRequestUrlObject = new URL(parsedRequestUrl);
    const parsedRequestUrlPathName =
      parsedRequestUrlObject.pathname.split("/")[1];

    const response = await fetch(parsedRequestUrl);
    const html = await response.text();

    const $ = cheerio.load(html);

    // get the links from the page
    $("a").each((i, el) => {
      const crawledHrefString = $(el).attr("href") || "";
      const crawledUrlObject = new URL(crawledHrefString, parsedRequestUrl);
      console.log(new Date(), ": found link", crawledUrlObject.href);

      // relative links & pathnames
      if (crawledUrlObject.hostname === parsedRequestUrlObject.hostname) {
        allRelativeHrefs.add(crawledUrlObject.href);
        const pathName = crawledUrlObject.pathname.split("/")[1];
        if (pathName) relativePathNames.add(pathName);
        if (pathName === parsedRequestUrlPathName)
          samePathName.add(crawledUrlObject.href);
      }

      allHrefs.add(crawledUrlObject.href);
    });

    res.status(200).json({
      samePathName: Array.from(samePathName),
      relativePathNames: Array.from(relativePathNames),
      allRelativeHrefs: Array.from(allRelativeHrefs),
      allHrefs: Array.from(allHrefs),
    });
  } catch (error: any) {
    res.status(500).json({ error });
  }
}
