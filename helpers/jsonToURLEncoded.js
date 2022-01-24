export const jsonToURLEncoded = (element,key, list) => {
    const currentList = list || [];
    if(typeof(element)=='object'){
      for (const idx in element)
        jsonToURLEncoded(element[idx],key?key+'['+idx+']':idx,currentList);
    } else {
      currentList.push(key+'='+encodeURIComponent(element));
    }
    return currentList.join('&');
  }