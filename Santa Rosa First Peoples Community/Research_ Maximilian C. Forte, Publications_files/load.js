const files = ["https://htlbid.com/v3/audiomack.com/aditude-loader.js","https://htlbid.com/v3/audiomack.com/aditude-loader.css"];
files.forEach((url) => {
  if (url.includes('.css')) {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.head.append(link);
  } else {
    const script = document.createElement('script');
    script.src = url;
    document.head.append(script);
  }
});