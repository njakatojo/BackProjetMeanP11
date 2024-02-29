module.exports = {
    start, upload
};
function start(response) {
    response.render('index');
}
function upload(response) {
    setTimeout(() => {
        response.writeHead(200, {"Content-Type" : "text/plain"})
        response.write("Bonjour upload");
        response.end();
    }, 10000)
}