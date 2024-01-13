import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { getILCSActs } from './extractors.js';

const CHAPTER_INDEX_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

const ACT_INDEX_TEST_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=5';

const ACT_TEXT_TEST_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=3275&ChapterID=5'

const browser = await puppeteer.launch();
const actPage = await browser.newPage();
await actPage.goto(ACT_INDEX_TEST_URL);

const actIndexString = await actPage.$$eval('td ul > *', getILCSActs);

console.log(actIndexString);

browser.close();