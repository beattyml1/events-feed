import {DateStructure, TimeStructure, isStructuredDate, isStructuredTime} from "./CoreTypes";

export type Modes = 'directText'|'text'|'href';
export type StructuredTextSelector = { selector: string, mode: Modes };
export type TextSelector = StructuredTextSelector | string;
export type Scoped<T> = { scope: string, elements: T };
export type PossiblyStructuredSelector<T> = TextSelector | T | Scoped<T>
export type DateSelector = PossiblyStructuredSelector<DateStructure<TextSelector>>;
export type TimeSelector = PossiblyStructuredSelector<TimeStructure<TextSelector>>;
export type AnySelector = TextSelector | DateSelector | TimeSelector;

export function RawDataScraper($: CheerioStatic) {
  function getRawSelectorData(scope: Cheerio, selector: AnySelector) {
    if (!selector || !scope) return null;
    if (typeof selector === "string") {
      return text(scope, selector);
    } else if (isStructuredText(selector)) {
      return getValue(scope, selector.selector, selector.mode);
    } else if (isStructuredDate(selector)){
      return {
        day: getRawSelectorData(scope, selector.day),
        month: getRawSelectorData(scope, selector.month),
        year: getRawSelectorData(scope, selector.year)
      };
    } else if (isStructuredTime(selector)){
      return {
        hour: getRawSelectorData(scope, selector.hour),
        minute: getRawSelectorData(scope, selector.minute),
        amPm: getRawSelectorData(scope, selector.amPm)
      };
    } else if (isScoped(selector)){
      return getRawSelectorData(scope.find(selector.scope), selector.elements);
    }
  }

  function isScoped(x: AnySelector): x is Scoped<any> {
    let y = x as Scoped<any>;
    return !!y.scope;
  }

  function isStructuredText(x: AnySelector): x is StructuredTextSelector {
    let y = x as StructuredTextSelector;
    return !!y.mode && !!y.selector;
  }

  function forEl(e, selector, thing: (x: Cheerio) => string) {
    try {
      return thing(selector && $(e).find(selector));
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  function getValue(e, selector, mode?: Modes) {
    switch (mode) {
      case "directText": return directText(e, selector);
      case "href": return href(e, selector);
      default: return text(e, selector);

    }
    return (mode=== 'directText') ? directText(e, selector) : text(e, selector)
  }

  function text(e, selector) {
    return forEl(e, selector, _=>_.text())
  }

  function href(e, selector) {
    return forEl(e, selector, _=> _.attr('href'))
  }

  function directText(e, selector) {
    return forEl(e, selector, _ => _
      .clone()    //clone the element
      .children() //select all the children
      .remove()   //remove all the children
      .end()  //again go back to selected element
      .text())
  }
  return { getRawSelectorData }
}
