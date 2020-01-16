// Surrounding characters around position in file
const CONTEXT = 40;

// New HTML
const TEMPLATES = {
    LINE: ({ string }) => `<span onclick=handleStringClick(this) style="text-decoration: underline; cursor: pointer;">${string}</span>`,
    LOADED_LINE: ({ string, context, code }) => `<span style="text-decoration: underline; text-decoration-style: dashed;">${string}</span><br/><span style="white-space: pre-wrap; cursor: zoom-in;" class="zoomable" data-context="${context}" data-string="${string}">${code}</span><br/>`,
    CODE: ({ left, position, right }) => `${left.replace(/</g,'&lt;').replace(/>/g,'&gt;')}<span style="color: white; background-color: black;">${position}</span>${right.replace(/</g,'&lt;').replace(/>/g,'&gt;')}`,
};

// Memoize expesive url fetch results
const memoReadUrl = (() => {
    const memo = {};
    return (url, done) => {
        if (memo[url]) {
            return done(memo[url]);
        }

        readUrl(url, data => {
            memo[url] = data;
            done(memo[url]);
        });
    };
})();

function main(string, contextSize, done) {
    const parts = string.split('@');
    const urlParts = parts[parts.length - 1].split(':');

    const colNo = parseInt(urlParts[urlParts.length - 1], 10);
    const lineNo = parseInt(urlParts[urlParts.length - 2], 10);
    const url = urlParts.slice(0, -2).join(':');

    memoReadUrl(url, data => {
        getPosition(data, lineNo, colNo, contextSize, (string, ndx) => {
            // Print result
            const fill = Array(ndx).fill(' ').join('') + '↓';
            console.log(fill);
            console.log(string);
            done(string, ndx);
        });
    });
}

function readUrl(url, done) {
    fetch(url)
        .then(response => {
            return response.text().then(done);
        })
}

function getPosition(data, lineNo, colNo, context, done) {
    const lines = data.split('\n');
    const line = lines[lineNo - 1];
    const string = line.substr(Math.max(colNo - context, 0), 2 * context);

    let charNdx = Math.floor(string.length / 2);
    if (colNo + context > string.length) {
        charNdx = colNo > context ? context : colNo;
    }

    done(string, charNdx);
}

function init(element) {
    const html = element.innerHTML;
    const newHTML = html.split('<br>').map(line => TEMPLATES.LINE({
        string: line.trim()
    })).join('<br>');
    element.innerHTML = newHTML;
}

// Load url content - global handler
function handleStringClick(element) {
    const string = element.innerHTML;
    element.innerHTML = `${string}...`;

    main(string, CONTEXT, (data, charNdx) => {
        const newHTML = TEMPLATES.LOADED_LINE({
            string,
            context: CONTEXT,
            code: TEMPLATES.CODE({
                left: data.substr(0, charNdx),
                position: data[charNdx],
                right: data.substr(charNdx + 1)
            })
        });
        element.outerHTML = newHTML;
    });
}

// Load more context - global handler
function handleZoomIn(element) {
    const string = element.getAttribute('data-string');
    const context = 2 * parseInt(element.getAttribute('data-context'), 10);

    element.setAttribute('data-context', context);
    main(string, context, (data, charNdx) => {
        element.innerHTML = TEMPLATES.CODE({
            left: data.substr(0, charNdx),
            position: data[charNdx],
            right: data.substr(charNdx + 1)
        });
    });
}

document.addEventListener('click', e => {
    if (e.target && e.target.className.indexOf('zoomable') > -1) {
        handleZoomIn(e.target);
    }
});

Element.prototype.filepos = function() {
    init(this);
};
