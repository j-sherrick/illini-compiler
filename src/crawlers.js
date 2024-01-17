import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { getILCSIndexString, ULISTCHILDREN, PCHILDREN } from './extractors.js';
import { parseChapterIndex, parseActIndex } from './parsers.js';

const CHAPTER_INDEX_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

const ACT_INDEX_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=5';

const ACT_TEXT_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=3658&ChapterID=5'

const browser = await puppeteer.launch();
// const chapterIndexPage = await browser.newPage();
// await chapterIndexPage.goto(CHAPTER_INDEX_URL);

// let chapterIndex = await chapterIndexPage.$$eval(ULISTCHILDREN, getILCSIndexString);
// chapterIndex = parseChapterIndex(chapterIndex);
// console.log(chapterIndex);

const actIndexPage = await browser.newPage();
await actIndexPage.goto(ACT_INDEX_URL);

let actIndex = await actIndexPage.$$eval(ULISTCHILDREN, getILCSIndexString);
actIndex = parseActIndex(actIndex);
// console.log(actIndex);

browser.close();