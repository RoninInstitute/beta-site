document.addEventListener("DOMContentLoaded", function () {
    const keywordDataEl = document.getElementById("keyword-data");
    const keywordData = keywordDataEl ? JSON.parse(keywordDataEl.textContent) : {};
    
    const rows = Array.from(document.querySelectorAll(".scholar-row"));
    const input = document.getElementById("keyword-search");

    
    // --- Filter function ---
    function filterByKeyword(keyword) {
	rows.forEach(row => {
	    const kws = row.dataset.keywords ? row.dataset.keywords.split(",") : [];
	    row.style.display = (!keyword || kws.includes(keyword)) ? "" : "none";
	});
	
	if (input) input.value = keyword || "";
	
	// Show or hide the clear filter button
	if (clearBtn) clearBtn.style.display = keyword ? "inline" : "none";
	
    }

    // replace references to clearBtn
    const clearBtn = document.getElementById("clear-keyword-search");
    
    // --- Autocomplete / search box ---
    if (input) {
	const keywords = Object.keys(keywordData).sort((a, b) => keywordData[b].count - keywordData[a].count);
	
	input.addEventListener("input", function () {
	    const val = input.value.toLowerCase();

	    const list = document.getElementById("keyword-suggestions")

	    list.innerHTML = "";

	    
	    // only show suggestions for 3 or more characters
	    if (val.length < 3) {
		//document.getElementById("keyword-suggestions").innerHTML = "";
		list.style.display = "none";
		return;
	    }
	    // filter and limit suggestions
	    const suggestions = keywords
	      .filter(k => k.toLowerCase().includes(val))
		  .slice(0, 5);  // limit to first 5 matches
	    
	    //const list = document.getElementById("keyword-suggestions");
	    //list.innerHTML = "";
	    
	    suggestions.forEach(k => {
		const li = document.createElement("li");
		li.textContent = `${k} (${keywordData[k].count})`;
		li.className = "keyword-suggestion-item";
		li.addEventListener("click", () => {
		    filterByKeyword(k);
		    list.innerHTML = "";
		    list.style.display = "none";  // hide after selection		    
		    const newUrl = new URL(window.location);
		    newUrl.searchParams.set("keyword", k);
		    window.history.replaceState({}, "", newUrl);
		});
		list.appendChild(li);
	    });
	    
	    // show list only if we actually added items
	    list.style.display = suggestions.length ? "block" : "none";
	});
    }
    
    // add listener for inline ×
    if (clearBtn) {
	clearBtn.addEventListener("click", () => {
	    filterByKeyword(null);
	    const list = document.getElementById("keyword-suggestions");
	    if (list) list.innerHTML = "";
	    const newUrl = new URL(window.location);
	    newUrl.searchParams.delete("keyword");
	    window.history.replaceState({}, "", newUrl);
	    input.focus();
	});
    }
    
    // --- Initialize from URL ---
    const params = new URLSearchParams(window.location.search);
    const filterKeyword = params.get("keyword");
    if (filterKeyword) filterByKeyword(filterKeyword);
});
