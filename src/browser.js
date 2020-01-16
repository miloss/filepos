
function readUrl(url, done) {
    fetch(url)
        .then((response) => {
            return done(response);
        })
}
