/**
 * @module ILCSExtractor
 * 
 * @description This module exports functions that extract data from the HTML of the Illinois Compiled Statutes (ILCS) website.
 * These functions are used by the `ILCSCrawler` class to parse the crawled data.
 */

import { TITLE, HREF, TOPIC, TOKEN, NL } from '../constants/strings.js';
import { ENTIRE_ACT_LINK } from '../constants/strings.js';

/**
 * This function is a pageFunction to be evaluated in the browser context by Puppeteer. It expects the result of a
 * querySelectorAll call on 'td ul *' selector, and returns a formatted string representing the index of ILCS chapters.
 * 
 * @param ulChildren children of a UL element that may contain a list of chapters or acts
 * @param titleString string constant for formatting the title of a chapter or act
 * @param urlString string constant for formatting the url to the page containing a chapter or act 
 * @param topicString string constant for formatting the topic of a chapter or subtopic of an act.
 * @param nlChar string constant for formatting a newline character
 * @returns a formatted string representing a list index of ILCS chapters or acts.
 */
function getILCSIndexString(
    ulChildren: Element[],
    titleString: string,
    urlString: string,
    topicString: string,
    nlChar: string):
    string {

    let chapterIndexString  = '';
    let currentTopic = '';
    for(const ulChild of ulChildren) {
        if ((ulChild.tagName === 'DIV' || ulChild.tagName === 'P') && ulChild.innerText !== '') {
            // trim() is always called on the innerText String to remove unexpected newlines
            currentTopic = ulChild.innerText.trim();
        }
        else if (ulChild.tagName === 'LI' && ulChild.innerText !== '') {
            chapterIndexString += titleString + ulChild.innerText.trim() + nlChar;
            chapterIndexString += topicString + currentTopic + nlChar;
            chapterIndexString += urlString + ulChild.querySelector('a').href + nlChar + nlChar;
        }
    }

    return chapterIndexString;
}


/**
 * This function is a pageFunction to be evaluated in the browser context by Puppeteer. It expects the result of a
 * querySelectorAll call on 'td p *' selector on the appropriate page, and returns a string representing the entire text of an act.
 * Each section of the act is separated by the delimiter token.
 * 
 * @param pChildren the children of a P element that may contain a table of acts
 * @param tokenString a string constant used as a delimiter token to separate acts 
 * @returns a formatted string representing the entire text of an act, with sections separated by tokenString
 */
function getILCSAct(
    pChildren: Element[],
    tokenString: string):
    string {

    let actText = '';
    for (const pChild of pChildren) {
        if (pChild.tagName === 'TABLE') {
            actText += pChild.innerText + tokenString;
        }
    }

    return actText;
}

/**
 * Some acts contain articles which are listed as links on the main page of the act. This function is a pageFunction that returns
 * the url of the 'View Entire Act' link, if it exists. It expects the result of a querySelectorAll call on 'td p a' selector on 
 * the appropriate page.
 * 
 * @param aNodes - an array of anchor elements that may contain a link to the entire act
 * @param viewEntireAct - a string constant used to identify the link to the entire act 
 * @returns a string with the href attribute found in the link to the entire act, if it exists, or an empty string if it doesn't
 */
function hasEntireAct(
    aNodes: Element[],
    viewEntireAct: string):
    string {
        
    let href = '';
    for (const aNode of aNodes) {
        if (aNode.innerText.toLowerCase().includes(viewEntireAct)) {
            href = aNode.href;
            break;
        }
    }
    return href;
}

export { 
    getILCSAct,
    getILCSIndexString,
    hasEntireAct
 }