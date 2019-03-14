function pageNavi(json) {
	var thisUrl = location.href,
		isLablePage = thisUrl.indexOf("/search/label/") != -1,
		thisLable = isLablePage ? thisUrl.substr(thisUrl.indexOf("/search/label/") + 14, thisUrl.length) : "";
	
	thisLable = thisLable.indexOf("?") != -1 ? thisLable.substr(0, thisLable.indexOf("?")) : thisLable;

	var baseUrl = isLablePage ? "/search/label/" + thisLable + "?updated-max=" : "/search?updated-max=",
		total = json.feed.entry.length,
		maxPage = Math.ceil(total / pageNaviConf.perPage);
	
	if (maxPage <= 1) {
		return;
	}
	var paged = 1,
		urls = [''];
	
	isLablePage ? urls.push("/search/label/" + thisLable + "?max-results=" + pageNaviConf.perPage) : urls.push("/?max-results=" + pageNaviConf.perPage);
	
	for (var i = 2; i <= maxPage; i++) {
		var j = (i - 1) * pageNaviConf.perPage - 1,
			time = json.feed.entry[j].published.$t,
			timestamp = time.substring(0, 19) + time.substring(23, 29);
		timestamp = encodeURIComponent(timestamp);
		
		if (thisUrl.indexOf(timestamp) != -1) {
			paged = i;
		}
		
		urls.push(baseUrl + timestamp + "&max-results=" + pageNaviConf.perPage);
	}
	
	pageNavi.show(urls, paged, maxPage);
}

pageNavi.show = function(urls, paged, maxPage) {
	var halfStart = Math.floor((pageNaviConf.numPages - 1)/2),
		halfEnd = pageNaviConf.numPages - 1 - halfStart,
		startPage = paged - halfStart;
	if (startPage <= 0) {
		startPage = 1;
	}
	endPage = paged + halfEnd;
	if ((endPage - startPage) < pageNaviConf.numPages) {
		endPage = startPage + pageNaviConf.numPages - 1;
	}
	if (endPage > maxPage) {
		endPage = maxPage;
		startPage = maxPage - pageNaviConf.numPages + 1;
	}
	if (startPage <= 0) {
		startPage = 1;
	}
	
	var html = '<span class="pages">Pages ' + paged + ' of ' + maxPage + '</span> ';
	
	if (startPage > 1) {
		html += '<a href="' + urls[1] + '">' + pageNaviConf.firstText + '</a>';
	}
	if (paged > 1) {
		html += '<a href="' + urls[paged - 1] + '">' + pageNaviConf.prevText + '</a>';
	}
	for (i = startPage; i <= endPage; ++i) {
		if (i == paged) {
			html += '<span class="current">' + i + '</span>';
		} else {
			html += '<a href="' + urls[i] + '">' + i + '</a>';
		}
	}
	if (paged < maxPage) {
		html += '<a href="' + urls[paged + 1] + '">' + pageNaviConf.nextText + '</a>';
	}
	if (endPage < maxPage) {
		html += '<a href="' + urls[maxPage] + '">' + pageNaviConf.lastText + '</a>';
	}
	
	document.write(html);
}

(function(){var b=location.href;if(b.indexOf("?q=")!=-1||b.indexOf(".html")!=-1){return}var d=b.indexOf("/search/label/")+14;if(d!=13){var c=b.indexOf("?"),a=(c==-1)?b.substring(d):b.substring(d,c);document.write('<script type="text/javascript" src="/feeds/posts/summary/-/'+a+'?alt=json-in-script&callback=pageNavi&max-results=99999"><\/script>')}else{document.write('<script type="text/javascript" src="/feeds/posts/summary?alt=json-in-script&callback=pageNavi&max-results=99999"><\/script>')}})();